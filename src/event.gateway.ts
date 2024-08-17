import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './service/chat.service';

@WebSocketGateway(80, {
    namespace: 'chatting',
    cors: '*',
})

export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }


    handleConnection(client: Socket) { }

    handleDisconnect(client: Socket) { }

    /**
     * EVENT: createRoom
     * 채팅방 생성
     * @param data 
     */
    @SubscribeMessage('createRoom')
    async createRoom(@MessageBody() data: { sender: number, receiver: number, communityId: number }) {
        const { sender, receiver, communityId } = data;
        const chatRoomId = await this.chatService.createChatRoom(sender, receiver, communityId);
        this.server.emit('roomCreated', chatRoomId);
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(
        @MessageBody() data: { content: string, memberId: number, chatRoomId: number }
    ) {
        const { content, memberId, chatRoomId } = data;
        const { nickname, profileUrl } = await this.chatService.saveMessage(content, memberId, chatRoomId);
        this.server.emit(`${chatRoomId}`, { content, memberId, nickname, profileUrl });
    }

    @SubscribeMessage('readMessage')
    async readMessage(
        @MessageBody() data: { memberId: number, chatRoomId: number }
    ) {
        const { memberId, chatRoomId } = data;
        await this.chatService.readMessage(memberId, chatRoomId);
    }

    @SubscribeMessage('getRooms')
    async getRooms(@MessageBody() data: { memberId: number }) {
        const { memberId } = data;
        const rooms = await this.chatService.getChatRoomListForUser(memberId);
        this.server.emit('roomList', rooms);
    }

    @SubscribeMessage('getChat')
    async getChat(@MessageBody() data: { chatRoomId: number, memberId: number }) {
        const { chatRoomId, memberId } = data;
        const chat = await this.chatService.getChat(chatRoomId, memberId);
        this.server.emit(`${chatRoomId}-chat`, chat);
    }
}

