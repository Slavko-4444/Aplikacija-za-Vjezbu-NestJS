import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/output/entities/article-feature.entity";
import { ArticlePrice } from "src/output/entities/article-price.entity";
import { Article } from "src/output/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { In, Repository } from "typeorm"
import { EditArticleDto } from "src/dtos/article/edit.article.dtos";
import { ArticleSearchDto } from "src/dtos/article/article.search.dto";

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

    async search(data: ArticleSearchDto): Promise<Article[]> {

        const builder = await this.article.createQueryBuilder("article"); // pravimo builder upita koji ce raditi nad tabelom article
    
        builder.innerJoinAndSelect('article.articlePrices', 'aP',
        'aP.createdAt = (SELECT MAX(ap.created_at) FROM article_price AS ap WHERE ap.article_id =  article.article_id)'
        ); // inner join article.articlePrices as aP
        builder.leftJoinAndSelect('article.articleFeatures', 'aF')

        builder.where('article.categoryId = :cId', { cId: data.categoryId });


        // trim("   Hello World     ") ->  "Hello World".
        if (data.keywords  && data.keywords.trim().length > 0) {
            builder.andWhere(`(article.name LIKE :kw OR 
                              article.excerpt LIKE :kw OR
                              article.description LIKE :kw)`, { kw: '%' + data.keywords + '%' });
        }

        // ili if(data.priceMin !== undefined || data.priceMin !== null) {}
        if (data.priceMin && typeof data.priceMin === 'number') {
            builder.andWhere('aP.price >= :min', { min: data.priceMin });
        }

        if (data.priceMax && typeof data.priceMax === 'number') {
            builder.andWhere('aP.price <= :max', { max: data.priceMax });
        }

        if (data.features && data.features.length > 0) 
            for (const feature of data.features) {
                builder.andWhere('aF.featureId = :fdId AND aF.value IN (:fVals)',
                    {
                        fdId: feature.featureId,
                        fVals: feature.values
                    });
            }
        
        let orderBy = 'article.name';
        let orderDirection : 'ASC'|'DESC' = 'ASC';

        if (data.orderBy) {
            orderBy = data.orderBy;        
            
            if (data.orderBy === 'price')
                orderBy = 'aP.price';
            
            if (data.orderBy === 'name')
                orderBy = 'article.name';
            
        }

        if (data.orderDirection)
            orderDirection = data.orderDirection;
        
        builder.orderBy(orderBy, orderDirection);

        let page = 0;
        let perPage: 5 | 10 | 25 | 50 | 75 = 25;
        
        if (typeof data.page === 'number')
            page = data.page;
        
        if (typeof data.itemsPerPage === 'number')
            perPage = data.itemsPerPage;
        
        builder.skip(page * perPage);
        builder.take(perPage);

        let articleIdes = await (await builder.getMany()).map(article => article.articleId);

        return await this.article.find({
            where: { articleId: In(articleIdes) },
            relations: {
                category : true,
                articleFeatures: true,
                features: true,
                articlePrices: true,
                photos: true
             } 
        })
    }
}