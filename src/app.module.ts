import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';// importovali smo
import { AppController } from './controllers/app.controller';
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
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/api/category.controller';
import { ArtilceController } from './controllers/api/article.controller';
import { ArticleService } from './services/article/article.service';
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
    TypeOrmModule.forFeature([ Administrator, Category, Article, ])
  ],
  controllers: [ AppController, AdministratorController, CategoryController, ArtilceController ],
  providers: [ AdministratorService, CategoryService, ArticleService ],
})
export class AppModule {}
