import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chat-room.entity";
import { ChatMessage } from "./chat-message.entity";

@Entity()
export class ChatRoomMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id)
    @JoinColumn()
    chatRoom: ChatRoom;

}