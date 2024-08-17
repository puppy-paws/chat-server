import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chat-room.entity";

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    sender: number;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id)
    @JoinColumn()
    chatRoom: ChatRoom;

    @CreateDateColumn()
    createdAt: Date;
}