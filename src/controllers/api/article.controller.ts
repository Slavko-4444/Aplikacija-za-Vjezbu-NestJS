import { Body, Controller, Post } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Article } from "output/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { ArticleService } from "src/services/article/article.service";
import { CategoryService } from "src/services/category/category.service";

@Controller('api/article')
@Crud(
    { 
        model: {
            type: Article,
        },
        params: {
            id: {
                field: 'articleId',
                type: 'number',
                primary: true
            }
        },
        query: {
            join: {
                articleFeatures: {
                    eager: true
                },
                category: {
                    eager: true   
                },
                features: {
                    eager: true
                },
                articlePrices: {
                    eager: true
                },

            }
        }
    }    
)
export class ArtilceController {
    constructor(public service: ArticleService)
    { }
    // POST http://localhost:3000:/api/article/fullArticle
    @Post('fullArticle')
    createFullArticle(@Body() data: AddArticleDto){
        return this.service.addFullArticle(data);
    }
}