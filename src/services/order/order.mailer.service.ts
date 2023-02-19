import { MailerService } from "@nestjs-modules/mailer/dist";
import { Injectable } from "@nestjs/common";
import { MailConfig } from "config/mail.config";
import { CartArticle } from "src/output/entities/cart-article.entity";
import { Order } from "src/output/entities/order.entity";


@Injectable()
export class OrderMailerService {

    constructor(private readonly mailerService: MailerService)
    { }    

    async senderOrderEmail(order: Order) {
        await  this.mailerService.sendMail({
            to: order.cart.user.email,
            from: MailConfig.senderEmail,
           bcc: MailConfig.orderNotificationMail,
            subject: 'Order details',
            encoding: "UTF-8",
            replyTo: 'no-replay@domain.com',
            html: this.OrderHtml(order)

        });
    }

    private OrderHtml(order: Order): string {
        let suma = order.cart.cartArticles.reduce((sum, current: CartArticle) => {
           
            return sum + current.quantity * current.article.articlePrices[current.article.articlePrices.length - 1].price 
        }, 0)

        return `<p>Zahvaljujemo se za Vašu porudžbinu!</p>
                <p>Ovo su detaljniji opisi Vaše porudžbine:</p>
                <ul>
                    ${order.cart.cartArticles.map((cartArticle: CartArticle) => { 
                        return `<li>
                            ${cartArticle.article.name} x ${cartArticle.quantity}
                        </li>`
                    }).join("")}
                </ul>
                <p>Cijena Vaše porudžbine iznosi : ${suma}EUR.</p>
                <p>Glavni izvršni direktor Slavko Sošić</p>`;
    }
}