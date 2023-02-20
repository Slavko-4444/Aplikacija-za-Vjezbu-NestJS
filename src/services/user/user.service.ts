import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { User } from "src/output/entities/user.entity";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { UserToken } from "src/output/entities/user-token.entity";


@Injectable()
export class UserService extends TypeOrmCrudService<User>{

    constructor(
        @InjectRepository(User) private readonly service: Repository<User>,
        @InjectRepository(UserToken) private readonly userToken: Repository<UserToken>
    ) {
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


    async addToken(userId: number, token: string, expiresAt: string) : Promise<UserToken>{
        
        const userToken = new UserToken();

        userToken.userId = userId;
        userToken.token = token;
        userToken.expiresAt = expiresAt;
        
        return await this.userToken.save(userToken);
    }


    async  getUserToken(token: string): Promise<UserToken>{

        return await this.userToken.findOne({where:{token: token}})
    }

    async invalidateToken(token: string): Promise<UserToken | ApiResponse>{

        const tempUserToken: UserToken = await this.getUserToken(token);

        if (!tempUserToken)
            return new ApiResponse('error', -10001, 'No such refresh token found');

        tempUserToken.isValid = 0;

        return await this.userToken.save(tempUserToken);
    }

    async invalidateUserTokens(userId: number): Promise<(UserToken | ApiResponse)[]> {

        const userTokens = await this.userToken.find({where:{userId: userId}});

        const results = []
        for (const usToken of userTokens)
            results.push( await this.invalidateToken(usToken.token));

        return results;
    }
}

