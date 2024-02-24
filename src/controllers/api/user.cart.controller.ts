import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AddArticleToCartDto } from "src/dtos/cart/add.article.to.cart";
import { EditArticleToCartDto } from "src/dtos/cart/edit.article.to.cart";
import { AllowToRoles } from "src/msci/allow.to.roles.descriptor";
import { ApiResponse } from "src/msci/api.response.class";
import { RoleCheckedGuard } from "src/msci/role.check.guards";
import { Cart } from "src/output/entities/cart.entity";
import { Order } from "src/output/entities/order.entity";
import { CartService } from "src/services/cart/cart.service";
import { OrderMailerService } from "src/services/order/order.mailer.service";
import { OrderService } from "src/services/order/order.service";

@Controller('api/user/cart')
export class UserCartController {
    
    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private orderMailer: OrderMailerService
    ) { }
    
    private async GetActiveCartForUser(userId: number): Promise<Cart>{
        let cart = await this.cartService.getLastCartByUserId(userId);
        if (!cart)
            cart = await this.cartService.createNewCartForUser(userId);
        
        return await this.cartService.getById(cart.cartId);
    }


    // GET http://localhost:3000/api/user/cart
    @Get()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async getCurrentCart(@Req() req: Request): Promise<Cart> {
        
        return await this.GetActiveCartForUser(req.token.Id);
    }

    // Post http://localhost:3000/api/user/addToCart
    @Post('addToCart')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async addToCart(@Body() data: AddArticleToCartDto, @Req() req: Request): Promise<Cart>{

        const cart = await this.GetActiveCartForUser(req.token.Id);
        return await this.cartService.addArticleToCart(cart.cartId, data.articleId, data.quantity);
    }
    // PATCH http://localhost:3000/api/user/cart
    @Patch()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async editToCart(@Body() data: EditArticleToCartDto, @Req() req: Request): Promise<Cart>{
   
        const cart = await this.GetActiveCartForUser(req.token.Id);
        return await this.cartService.changeQuantity(cart.cartId, data.articleId, data.newQuantity);
    }

    @Post('makeOrder')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async makeOrder(@Req() req: Request): Promise<Order|ApiResponse> {
        const cart = await this.GetActiveCartForUser(req.token.Id);
        const order = await this.orderService.add(cart.cartId);

        if (order instanceof ApiResponse)
            return order;
      
       await this.orderMailer.senderOrderEmail(order);
        return order;
    }


    //GET  http://localhost:3000api/user/cart/allOrders
    @Get('allOrders')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async getOrders(@Req() req: Request): Promise<Order[]>{
        return await this.orderService.getAllById(req.token.Id);
    }

}