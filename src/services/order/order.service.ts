import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatusDto } from "src/dtos/order/order.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { Cart } from "src/output/entities/cart.entity";
import { Order } from "src/output/entities/order.entity";
import { Repository } from "typeorm";


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order)
        private readonly order: Repository<Order>,
        @InjectRepository(Cart)
        private readonly cart: Repository<Cart>,
        
    ) { }


    async add(cartId: number): Promise<Order | ApiResponse> {
        const order = await this.order.findOne({where: {cartId: cartId}})

        if (order)
            return new ApiResponse('error', -7001, 'An order for this cart has already been made.');
        
        const cart = await this.cart.findOne({
            where: { cartId: cartId },
            relations: { cartArticles: true },
        })
        if (!cart)
            return new ApiResponse('error', -7002, 'No such cart article.');
        
        if (cart.cartArticles.length === 0)
            return new ApiResponse('error', -7003, 'This cart is empty.');
        
        const NewOrder: Order = new Order();
        NewOrder.cartId = cartId;
        NewOrder.userId = cart.userId;
        const savedOrder = await this.order.save(NewOrder);
    
        cart.createdAt = new Date();
        await this.cart.save(cart);
        return await this.getById(savedOrder.orderId);
    }


    async getById(orderId: number): Promise<Order> {
        return await this.order.findOne({
            where: { orderId: orderId },
            relations: [
                "cart",
                "cart.user",
                "cart.cartArticles",
                "cart.cartArticles.article",
                "cart.cartArticles.article.category",
                "cart.cartArticles.article.articlePrices"
            ]
        });
    }

    async cahngeStatus(orderId: number, data: OrderStatusDto): Promise<Order | ApiResponse> {
       
        const changingOrder: Order = await this.getById(orderId);
       
        if (!changingOrder)
            return new ApiResponse('error', -9001, 'The such order is not found!');

        changingOrder.status = data.status;

        return await this.order.save(changingOrder);
    }

    async getAllById(userId: number): Promise<Order[]> {

       
        return await this.order.find({
            where: {
                userId: userId,
            },
            relations: [
                "cart",
                "cart.user",
                "cart.cartArticles",
                "cart.cartArticles.article",
                "cart.cartArticles.article.category",
                "cart.cartArticles.article.articlePrices",
            ],
        });
    }
}