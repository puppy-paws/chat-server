import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('member')
export class Member {
    @PrimaryGeneratedColumn({
        type: 'bigint', // Ensure this matches the Java type
        name: 'id',
        primaryKeyConstraintName: 'member_id'
        // Optionally set the generation strategy to use sequence
        // generationStrategy: 'sequence', // You can specify this but it's optional
        // sequenceName: 'member_id', // The name of the sequence in the database
    })
    id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    provider: string;

    @Column({ nullable: false })
    nickname: string;

    @Column({ name: 'profile_url' })
    profileUrl: string;

    @Column({ name: 'dog_type' })
    dogType: string;

    @Column({ name: 'dog_name' })
    dogName: string;

    @Column({ name: 'dog_character' })
    dogCharacter: string;

    @Column({ name: 'dog_character2' })
    dogCharacter2: string;

    @Column({ name: 'dog_profile_url' })
    dogProfileUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}