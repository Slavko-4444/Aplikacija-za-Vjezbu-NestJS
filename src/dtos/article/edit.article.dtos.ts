import { ArticleFeatureComponentDto } from "./article.feature.components";
import * as Validator from "class-validator"
import { ArticleStatus } from "src/output/entities/types/article.entity.enums";

export class EditArticleDto { 

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

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsEnum(ArticleStatus)
    status: 'available' | 'visible' | 'hidden';

    @Validator.IsNotEmpty()
    @Validator.IsIn([0, 1])
    isPromoted: 0 | 1;
    
    @Validator.IsPositive()
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2
    })
    price: number;

    @Validator.IsOptional() // posto features moze biti niz a moze i biti null, zato prije Validator.IsArray naglasavamo da je opcionog tipa
    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true,
    })
    features:ArticleFeatureComponentDto[] | null;
}
 