import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoomMember } from "./chat-room-member.entity";
import { ChatMessage } from "./chat-message.entity";

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    communityId: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ChatRoomMember, (member) => member.chatRoom)
    chatRoomMembers: ChatRoomMember[];

    @OneToMany(() => ChatMessage, (message) => message.chatRoom)
    chatMessages: ChatMessage[];

}