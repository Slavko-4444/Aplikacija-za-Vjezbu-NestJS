import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/output/entities/article-feature.entity";
import { ArticlePrice } from "src/output/entities/article-price.entity";
import { Article } from "src/output/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { Repository } from "typeorm"

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article> {
    constructor(
        @InjectRepository(Article) private readonly article: Repository<Article>,
        @InjectRepository(ArticlePrice) private readonly article_Price: Repository<ArticlePrice>,
        @InjectRepository(ArticleFeature) private readonly article_Feature: Repository<ArticleFeature>
    )
    { 
        super(article);
    }

/**
 *@Predavanje44
 */
    async addFullArticle(data: AddArticleDto): Promise<Article | ApiResponse> {

        let newArticle: Article = new Article();
        newArticle.name       = data.name;
        newArticle.categoryId = data.categoryId;
        newArticle.excerpt    = data.excerpt;
        newArticle.description = data.description;

        let savedArticle = await this.article.save(newArticle);
        
        let articlePrice: ArticlePrice = new ArticlePrice();
        articlePrice.articleId         = savedArticle.articleId;
        articlePrice.price             = data.price;
        await this.article_Price.save(articlePrice);

        for (let feature of data.features) {
            let articleFeature: ArticleFeature = new ArticleFeature();
            
            articleFeature.articleId = savedArticle.articleId;
            articleFeature.featureId = feature.featureId;
            articleFeature.value = feature.value;

            await this.article_Feature.save(articleFeature);
        }

        return await this.article.findOne({
            where: {
                articleId: savedArticle.articleId
            },
            relations: {
                category : true,
                articleFeatures: true,
                features: true,
                articlePrices: true
             } 
        })
    }
}