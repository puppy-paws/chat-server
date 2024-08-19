import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMessage } from "src/entity/chat-message.entity";
import { ChatRoomMember } from "src/entity/chat-room-member.entity";
import { ChatRoom } from "src/entity/chat-room.entity";
import { Member } from "src/entity/member.entity";
import { DataSource, In, Not, Repository } from "typeorm";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(ChatRoomMember)
        private chatRoomMemberRepository: Repository<ChatRoomMember>,
        @InjectRepository(ChatMessage)
        private chatMessageRepository: Repository<ChatMessage>,
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        private dataSource: DataSource
    ) { }

    // create chatroom
    async createChatRoom(sender: number, receiver: number, communityId: number) {
        // find chat room 
        const findChatRoom = await this.chatRoomRepository.findOne({
            where: {
                communityId,
                chatRoomMembers: {
                    user_id: receiver
                }
            },
            relations: ["chatRoomMembers"]
        });

        // if chatroom exists do not create chatroom
        if (findChatRoom != null) {
            return 0;
        }

        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            // chatroom create
            const chatRoom = this.chatRoomRepository.create();
            const newChatRoom = await this.chatRoomRepository.save(chatRoom);

            // chatroom member Info
            const senderInfo = this.chatRoomMemberRepository.create({
                user_id: sender,
                chatRoom: newChatRoom
            });

            const receiverInfo = this.chatRoomMemberRepository.create({
                user_id: receiver,
                chatRoom: newChatRoom
            });

            // save
            await qr.manager.save(senderInfo);
            await qr.manager.save(receiverInfo);

            // commit transaction
            await qr.commitTransaction();
            return newChatRoom.id;
        } catch (e) {
            console.log(e)
            await qr.rollbackTransaction();
        } finally {
            await qr.release();
        }
    }

    // save message
    async saveMessage(content: string, userId: number, chatRoomId: number) {
        // chatroom info
        const chatRoom = await this.chatRoomRepository.findOneBy({ id: chatRoomId });

        // chat message create
        const message = this.chatMessageRepository.create({
            content,
            sender: userId,
            chatRoom
        });

        // chat message save
        await this.chatMessageRepository.save(message);

        // chat sender info
        const { nickname, profileUrl } = await this.memberRepository.findOneBy({
            id: userId
        });

        return { nickname, profileUrl };
    }

    async readMessage(memberId: number, chatRoomId: number) {
        // memberId가 아닌 다른 맴버의 메세지 id 가져오기
        const chatMessageIds = await this.chatMessageRepository.find({
            select: ['id'],
            where: {
                chatRoom: {
                    id: chatRoomId
                },
                sender: Not(memberId)
            },
            relations: ['chatRoom']
        });

        // get message id
        const ids = chatMessageIds.map(message => message.id);

        if (ids.length > 0) {
            // update read message
            await this.chatMessageRepository
                .createQueryBuilder()
                .update()
                .set({ status: true })
                .where({ id: In(ids) })
                .execute();
        }
    }

    // get chatroom list
    async getChatRoomListForUser(userId: number) {
        // chat room member 
        const chatList = await this.chatRoomMemberRepository.find({
            where: {
                user_id: userId
            },
            relations: ['chatRoom']
        });

        const newChatList = await Promise.all(chatList.map(async (chat) => {
            const { chatRoom, user_id } = chat;

            // find chat receiver 
            const receiverRoomInfo = await this.chatRoomMemberRepository.findOne({
                where: {
                    chatRoom: {
                        id: chatRoom.id
                    },
                    user_id: Not(userId)
                },
                relations: ['chatRoom']
            });

            // get receiver member info
            const receiverInfo = await this.memberRepository.findOneBy({
                id: receiverRoomInfo.user_id
            });

            const { id, nickname, profileUrl } = receiverInfo;

            // get latest message
            const latestMessage = await this.chatMessageRepository.findOne({
                where: { chatRoom: { id: chatRoom.id } },
                order: {
                    createdAt: 'DESC'
                },
                relations: ['chatRoom']
            });

            const content = latestMessage?.content ?? null;
            const createdAt = latestMessage?.createdAt ?? null;

            // get unreadMessage count
            const unreadMessage = await this.chatMessageRepository
                .createQueryBuilder()
                .select('COUNT(id)')
                .where('sender = :id', { id })
                .andWhere('status = false')
                .andWhere(`"chatRoomId" = :roomId`, { roomId: chatRoom.id })
                .getRawOne();

            const unreadMessagesCount = unreadMessage.count;

            return {
                id: chatRoom.id,
                userId: user_id,
                receiverInfo: {
                    id,
                    nickname,
                    profileUrl
                },
                lastMessage: {
                    content,
                    createdAt,
                },
                unreadMessagesCount
            };
        }));

        return newChatList;
    }

    // chat list
    async getChat(chatRoomId: number, memberId: number) {
        // find receiver 
        const receiverRoomInfo = await this.chatRoomMemberRepository.findOne({
            where: {
                chatRoom: {
                    id: chatRoomId
                },
                user_id: Not(memberId)
            },
            relations: ['chatRoom']
        });

        console.log(`get chat receiver: `, receiverRoomInfo);

        // get receiver member info
        const receiverInfo = await this.memberRepository.findOneBy({
            id: receiverRoomInfo.user_id
        });

        // get chatRoom chat list
        const chat = await this.chatMessageRepository.find(
            {
                where: {
                    chatRoom: {
                        id: chatRoomId
                    }
                },
                order: {
                    createdAt: 'ASC'
                },
                relations: ['chatRoom']
            }
        );

        const result = {
            receiverInfo: {
                id: receiverInfo.id,
                nickname: receiverInfo.nickname,
                profileUrl: receiverInfo.profileUrl
            },
            chat
        };

        return result;
    }
}