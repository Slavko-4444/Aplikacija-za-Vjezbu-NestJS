import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';// importovali smo
import { AppController } from './app.controller';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from '../output/entities/administrator.entity';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import { ArticleFeature } from 'output/entities/article-feature.entity';
import { Article } from 'output/entities/article.entity';
import { ArticlePrice } from 'output/entities/article-price.entity';
import { CartArticle } from 'output/entities/cart-article.entity';
import { Cart } from 'output/entities/cart.entity';
import { Category } from 'output/entities/category.entity';
import { Feature } from 'output/entities/feature.entity';
import { Order } from 'output/entities/order.entity';
import { Photo } from 'output/entities/photo.entity';
import { User } from 'output/entities/user.entity';
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
        User  
      ]
    }),
    TypeOrmModule.forFeature([ Administrator ])
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
