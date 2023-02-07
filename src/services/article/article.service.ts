import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/output/entities/article-feature.entity";
import { ArticlePrice } from "src/output/entities/article-price.entity";
import { Article } from "src/output/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { Repository } from "typeorm"
import { EditArticleDto } from "src/dtos/article/edit.article.dtos";

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

    async editFullArticle(articleId: number, data: EditArticleDto): Promise<Article | ApiResponse> {
        
        let existingArticle: Article = await this.article.findOne({
            where: {
                articleId: articleId
            }, relations: {
                articlePrices: true,
                articleFeatures: true  
            }
        });

        if (!existingArticle)
            return new ApiResponse('error', -5001, "Uncorrected id. Article not found.");
        
    
        existingArticle.categoryId = data.categoryId;
        existingArticle.name = data.name;
        existingArticle.excerpt = data.excerpt;
        existingArticle.description = data.description;
        existingArticle.status = data.status;
        existingArticle.isPromoted = data.isPromoted;

        let savedArticle = await this.article.save(existingArticle);
        if (!savedArticle)
            return new ApiResponse('error', -5001, "Article could not be saved.")
        
        const newPrice: string = Number(data.price).toFixed(2);// 129.1341 -> "129.13"

        let OldPrice: number = existingArticle.articlePrices[existingArticle.articlePrices.length - 1].price;
        let OldPriceString: string = Number(OldPrice).toFixed(2);
        
        if (newPrice !== OldPriceString)
        {
           let  NewArticlePrices = new ArticlePrice();    
            NewArticlePrices.articleId = articleId;
            NewArticlePrices.price = data.price;

            let SavedArticlePrice: ArticlePrice = await this.article_Price.save(NewArticlePrices);
            
            if (!SavedArticlePrice)
                return new ApiResponse('error', -5002, "ArticlePrice could not be saved.")
        }

        if (data.features) {
            await this.article_Feature.remove(existingArticle.articleFeatures); // brisemo sve articlefeature kako bismo dodali nove
            
            for (let feature of data.features) {
                let articleFeature: ArticleFeature = new ArticleFeature();
                
                articleFeature.articleId = articleId;
                articleFeature.featureId = feature.featureId;
                articleFeature.value = feature.value;
    
                await this.article_Feature.save(articleFeature);
            }
        }

        return await this.article.findOne({ 
            where: { articleId: articleId },
            relations: {
                articlePrices: true, 
                articleFeatures: true  
            }
        });

    }
}