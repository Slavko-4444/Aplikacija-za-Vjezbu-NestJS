import * as Validator from "class-validator"

export class UserRegistrationDto {

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

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3, 64)
        
    forename: string;
    
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3, 64)
        
    surname: string;

    @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber(null)
        
    phoneNumber: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(8, 512)
        
    postalAddress: string;
}