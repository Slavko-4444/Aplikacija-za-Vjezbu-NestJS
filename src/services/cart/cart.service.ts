import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { async } from "rxjs";
import { Article } from "src/output/entities/article.entity";
import { CartArticle } from "src/output/entities/cart-article.entity";
import { Cart } from "src/output/entities/cart.entity";
import { Order } from "src/output/entities/order.entity";
import { Repository } from "typeorm";




@Injectable()

export class CartService {

   
    constructor(
        @InjectRepository(Cart) private readonly cart: Repository<Cart>,
        @InjectRepository(Article) private readonly article: Repository<Article>,
        @InjectRepository(Order) private readonly order: Repository<Order>,
        @InjectRepository(CartArticle) private readonly cartArticle: Repository<CartArticle>
    )
    { }

    async getLastCartByUserId(userId: number): Promise<Cart | null> {

        const carts: Cart[] = await this.cart.find({
            where: {
                userId: userId
            },
            order: {
                createdAt: "DESC"
            },
            take: 1,
            relations: ["order"]
        })

        if (!carts || carts.length === 0)
            return null;
        
        const cart: Cart = carts[0];

        if (cart.order !== null  || cart.order === undefined)
            return null;
        
        return cart;
    }

    async createNewCartForUser(userId: number): Promise<Cart> {
        
        const newCart: Cart = new Cart();
        newCart.userId = userId;
        return await this.cart.save(newCart);
    }

    async addArticleToCart(cartId: number, articleId: number, quantity: number): Promise<Cart>{
            
        let record: CartArticle = await this.cartArticle.findOne({
            where: {
                articleId: articleId,
                cartId: cartId
            }
        });

        if (!record) {
            record = new CartArticle();
            record.articleId = articleId;
            record.cartId = cartId;
            record.quantity = quantity;

        }
        else
            record.quantity += quantity;
        
        await this.cartArticle.save(record);

        return await this.getById(cartId);
    }

    async getById(cartId: number): Promise<Cart>{

        return await this.cart.findOne({ 
            where: { cartId: cartId },
            relations: ["user", "cartArticles", "cartArticles.article", "cartArticles.article.category", "cartArticles.article.articlePrices"]
        })
    }

    async changeQuantity(cartId: number, articleId: number, newQuantity: number): Promise<Cart> {

        let record: CartArticle = await this.cartArticle.findOne({
            where: {
                cartId: cartId,
                articleId: articleId
            }
        });

        if (record) {
            record.quantity = newQuantity;

            if (record) {
                record.quantity = newQuantity;
                
                if (record.quantity === 0)
                    await this.cartArticle.delete(record.cartArticleId);
                else
                    await this.cartArticle.save(record);
            }
        }

        return await this.getById(cartId);
    }

}