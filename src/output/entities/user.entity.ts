import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import * as Validator from "class-validator"

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 255
  })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain: false, // ne dozvoljovamo ip adresu u email-u : slavko@128.0.0.1
    allow_utf8_local_part: true,
    require_tld: true,// ne moze samo slavko@localhost vec trazimo slavko@localhost.com (top level domain a ne samo lokalni kao sto je ovdje localhost)

    })
  email: string;

  @Column({
    type: "varchar",
    name: "password_hash",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')  
  passwordHash: string;

  @Column({ name: "forename", length: 64 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 64)
  forename: string;

  @Column({ type: "varchar", length: 64})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 64)
  surname: string;

  @Column({
    type: "varchar",
    name: "phone_number",
    unique: true,
    length: 64
  })
  @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber(null) // znaci da korisnik mora da ukuca +382 68 itd..
  phoneNumber: string;

  @Column({ type: "text", name: "postal_address" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(8, 512)
  postalAddress: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
