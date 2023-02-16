import * as Validator from "class-validator"

export class UseLoginDto {

    @Validator.IsNotEmpty()
    @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true,
    })
    email: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 40)
    password: string;
}