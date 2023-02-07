import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { User } from "src/output/entities/user.entity";
import { Repository } from "typeorm";
import * as crypto from "crypto";


@Injectable()
export class UserService extends TypeOrmCrudService<User>{

    constructor(@InjectRepository(User) private readonly service: Repository<User>) {
        super(service);
    }


   async register(data: UserRegistrationDto): Promise<User|ApiResponse> {

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordString = passwordHash.digest('hex').toUpperCase();
    
    let NewUser: User = new User();
       NewUser.surname = data.surname;
       NewUser.forename = data.forename;
       NewUser.email = data.email;
       NewUser.passwordHash = passwordString;
       NewUser.phoneNumber = data.phoneNumber;
       NewUser.postalAddress = data.postalAddress;


       try {
           
           let SavedUser: User = await this.service.save(NewUser);
           return SavedUser;
        } catch (error) { 
           return new ApiResponse(error.message, -707, 'New user account cannot be saved!');
       }
    }    
    
    getById(id: number):Promise<User> {
        return this.service.findOneById(id);  
    }

    
    async getByEmail(email: string): Promise<User | null> {
        
        const user : User = await this.service.findOneBy({
            email: email
        });
         
        if (user === undefined)
            return null;
        
        return user;
    }
}

