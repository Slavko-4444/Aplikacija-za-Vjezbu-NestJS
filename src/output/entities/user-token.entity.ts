import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import * as Validator from "class-validator"

@Entity() 
export class UserToken {
    
    @PrimaryGeneratedColumn({name: 'user_token_id', type: 'int', unsigned: true})
    userTokenId: number;

    @Column({ type: "int", name: "user_id", unsigned: true }) 
    @Validator.IsNotEmpty()
    @Validator.IsNumber()
    userId: number;

    @Column({ name: 'created_at', type: 'timestamp' })
    @Validator.IsNotEmpty()
    @Validator.IsString()
    createdAt: string;

    @Column({ name: 'token', type: 'text' })
    @Validator.IsNotEmpty()
    @Validator.IsString()
    token: string;

    @Column({ name: 'expires_at', type: 'datetime' })
    @Validator.IsNotEmpty()
    @Validator.IsString()
    expiresAt: string;

    @Column({ name: 'is_valid', type: 'tinyint', default: 1 })
    @Validator.IsNotEmpty()
    @Validator.IsIn([0, 1])
    isValid: number;
}