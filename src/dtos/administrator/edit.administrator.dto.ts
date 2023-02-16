import * as Validator from "class-validator"
export class EditAdministrator{
    @Validator.IsString()
    @Validator.Length(6, 40)
    password: string;
}