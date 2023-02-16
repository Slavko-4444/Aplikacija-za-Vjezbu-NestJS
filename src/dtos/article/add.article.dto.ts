import * as Validator from "class-validator"
import { ArticleFeatureComponentDto } from "./article.feature.components";


export class AddArticleDto { 

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3, 20)
    name: string;

    categoryId: number;
    
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10, 255)
    excerpt: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10, 10000)
    description: string;

    @Validator.IsPositive()
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2
    })
    price: number;

    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true,
    })
    features: ArticleFeatureComponentDto[]
}
 