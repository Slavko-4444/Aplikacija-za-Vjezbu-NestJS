import * as Validator from "class-validator"

export class AuthorizationDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[a-z][a-z0-9\.]{3,15}[a-z0-9]$/)
    username: string;
    
    @Validator.IsString()
    @Validator.Length(6, 40)
    password: string;
}