import * as Validator from "class-validator"

export class ArticleSearchDeatureComponentDTO {

    featureId: number;

    @Validator.IsArray()    
    @Validator.IsNotEmpty({
        each: true, // na ovaj nacin validator provjerava da li je tacno da nije prazan svaki element niza values
    })
    @Validator.IsString({
            each: true
        })
    @Validator.Length(1, 255, {each: true})
    values: string[];
}