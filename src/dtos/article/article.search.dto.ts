import * as Validator from "class-validator"
import { ArticleSearchDeatureComponentDTO } from "./article.search.features.component";

export class ArticleSearchDto { 

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    categoryId: number;

    @Validator.IsOptional() // moze i ne mora da bude setovano..
    @Validator.IsString()
    @Validator.Length(0, 20)
    keywords: string;   // po njemu cemo raditi pretragu u okviru 3 polja : name, excerpt, description


    @Validator.IsOptional() 
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    @Validator.IsPositive()
    priceMin: number;


    @Validator.IsOptional() 
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    @Validator.IsPositive()
    priceMax: number;

    features: ArticleSearchDeatureComponentDTO[]; 

    
    @Validator.IsOptional()
    @Validator.IsIn(['name', 'price'])
    orderBy: 'name' | 'price';

    @Validator.IsOptional()
    @Validator.IsIn(['ASC', 'DESC'])
    orderDirection: 'ASC' | 'DESC';

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Validator.IsPositive()
    page: number;

    @Validator.IsOptional()
    @Validator.IsIn([5, 10, 25, 50, 75])
    itemsPerPage: 5 | 10 | 25 | 50 | 75;
}
