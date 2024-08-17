import { Module } from '@nestjs/common';
import { ChatGateway } from './event.gateway';
import { ChatService } from './service/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatMessage } from './entity/chat-message.entity';
import { ChatRoomMember } from './entity/chat-room-member.entity';
import { Member } from './entity/member.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV = '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [ChatRoom, ChatMessage, ChatRoomMember, Member],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([ChatRoom, ChatMessage, ChatRoomMember, Member])
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule { }
