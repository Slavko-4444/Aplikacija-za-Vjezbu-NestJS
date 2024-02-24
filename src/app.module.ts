import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';// importovali smo
import { AppController } from './controllers/app.controller';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from './output/entities/administrator.entity';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import { ArticleFeature } from 'src/output/entities/article-feature.entity';
import { Article } from 'src/output/entities/article.entity';
import { ArticlePrice } from 'src/output/entities/article-price.entity';
import { CartArticle } from 'src/output/entities/cart-article.entity';
import { Cart } from 'src/output/entities/cart.entity';
import { Category } from 'src/output/entities/category.entity';
import { Feature } from 'src/output/entities/feature.entity';
import { Order } from 'src/output/entities/order.entity';
import { Photo } from 'src/output/entities/photo.entity';
import { User } from 'src/output/entities/user.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryService } from './services/category/category.service';
import { FeatureService } from './services/feature/feature.service';
import { CategoryController } from './controllers/api/category.controller';
import { ArtilceController } from './controllers/api/article.controller';
import { ArticleService } from './services/article/article.service';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middleware/authorization.middlewares';
import { PhotoService } from './services/photoService/photo.service';
import { FeatureController } from './controllers/api/feature.controler';
import { UserService } from './services/user/user.service';
import { CartService } from './services/cart/cart.service';
import { UserCartController } from './controllers/api/user.cart.controller';
import { OrderService } from './services/order/order.service';
import { MailerModule } from '@nestjs-modules/mailer'
import { MailConfig } from 'config/mail.config';
import { OrderMailerService } from './services/order/order.mailer.service';
import { AdministratorOrderController } from './controllers/api/administrator.order.controller';
import { UserToken } from './output/entities/user-token.entity';
import { AdministratorToken } from './output/entities/administrator-token.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Administrator,
        Article,
        ArticleFeature,
        ArticlePrice,
        CartArticle,
        Cart,
        Category,
        Feature,
        Order,
        Photo,
        User,  
        UserToken,
        AdministratorToken,
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Article,
      ArticleFeature,
      ArticlePrice,
      CartArticle,
      Cart,
      Category,
      Feature,
      Order,
      Photo,
      User,
      UserToken,
      AdministratorToken,
    ]),
    MailerModule.forRoot({
      //smtps://user@domain.com:pass@smtp.domain.com
     // transport: 'smtps://' + MailConfig.username + ':' + MailConfig.password + '@' + MailConfig.hostname,
      transport: {
        host: MailConfig.hostname,
        auth: {
          user: MailConfig.username,
          pass: MailConfig.password,
        }
      }
    }),
    
  ],
  controllers: [ AppController, AdministratorController, CategoryController, ArtilceController, AuthController, FeatureController, UserCartController, AdministratorOrderController ],
  providers: [AdministratorService, CategoryService, ArticleService, PhotoService, FeatureService, UserService, CartService, OrderService, OrderMailerService ],
  exports: [
    AdministratorService, //ovo je prevashodno za authoMiddleware koji se ne nalazi u okviru ovih modula
    UserService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*');
  }
}
