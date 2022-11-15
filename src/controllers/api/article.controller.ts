import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Article } from "output/entities/article.entity";
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
                }
            }
        }
    }    
)
export class ArtilceController {
    constructor(public service: ArticleService)
    { }
}