import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import * as Validator from "class-validator"
import { OrderStatus } from "./types/order.entity.enums";

@Index("uq_order_cart_id", ["cartId"], { unique: true })
@Entity("order")
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "int",
    name: "cart_id",
    unique: true,
    unsigned: true
  })
  cartId: number;

  @Column({
    type: "enum",
    enum: ["pending", "rejected", "accepted", "shipped"],
    default: () => "'pending'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsEnum(OrderStatus)
  status: "pending" | "rejected" | "accepted" | "shipped";

  @Column({
    type: "int",
    name: "user_id",
    unique: true,
    unsigned: true
  })
  userId: number;

  @OneToOne(() => Cart, (cart) => cart.order, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;
}
