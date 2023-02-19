import * as Validator from "class-validator"
import {OrderStatus} from "src/output/entities/types/order.entity.enums"

export class OrderStatusDto {

  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsEnum(OrderStatus)
  status: "pending" | "rejected" | "accepted" | "shipped";
}