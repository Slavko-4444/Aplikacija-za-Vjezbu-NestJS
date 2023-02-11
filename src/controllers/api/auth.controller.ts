import { Body, Controller, Post, Put, Req } from "@nestjs/common";
import { Administrator } from "src/output/entities/administrator.entity";
import { AuthorizationDto } from "src/dtos/authorisation/authorisation.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { loginAuthoInfo } from "src/dtos/authorisation/login.autho.info";
import * as jwt from "jsonwebtoken";
import { JwtDataDto } from "src/dtos/authorisation/jwt.dto";
import { Request } from "express";
import { request } from "https";
import { jwtSecret } from "config/jwt.secret";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/output/entities/user.entity";
import { UserService } from "src/services/user/user.service";
import { UseLoginDto } from "src/dtos/user/user.login.dto";


@Controller('auth/Administrator')
export class AuthController {

    constructor(public administratorService: AdministratorService, public userService: UserService)
    { }

    //POST http://localhost:3000/auth/Administrator/login/admin
    @Post('login/admin')
    async doLogin(@Body() data: AuthorizationDto,@Req() request:Request): Promise<loginAuthoInfo| ApiResponse> {
        
        const admin: Administrator = await this.administratorService.getByUsername(data.username);
        
        // provjera za username:
        if (admin === null)
            return new Promise(resolve => resolve(new ApiResponse('error', -3001, 'Greska sa datim username-om')));
        
        // provjera za password:
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordString = passwordHash.digest('hex').toUpperCase();

        if (passwordString !== admin.passwordHash) {
            return new Promise(resolve => resolve(new ApiResponse('error', -3002, 'Greska, netacna lozinka !')));
        }

        // ono sto zelimo da vratimo nije administrator sa svojim id, i ostalim detaljima vec,
        // objekat koji sadrzi: 
        /**
         * administratorId
         * username
         * TOKEN    (JWT JSONwebTOKEN)
         * token = JSON{ adminId, username, exp, ip, ua}, exp - datum isteka, ua - trenutni useragent
         * moramo instalirati jsonwebtoken
         * 
         * */
        const JwtData = new JwtDataDto();
        JwtData.role = "administrator";
        JwtData.Id = admin.administratorId;
        JwtData.username = admin.username;
        
        let temporaryTime = new Date(); // uzimamo trenutno vrijeme...
        temporaryTime.setDate(temporaryTime.getDate() + 14);// 14 days
        const expiredTime = temporaryTime.getTime() / 1000; // dijelimo i pretvaramo u sekunde
        
        JwtData.exp = expiredTime;

        // pristupamo ip adresi i useragent-u koji se nalaze u request dijelu :
        JwtData.ip = request.ip;
        //console.log("Ip address: " + JwtData.ip);
        JwtData.ua = request.headers["user-agent"].toString();
       // console.log("useragent-u: " + JwtData.ua);

        // podaci koje smo skupili u JwtData objektu za token nisu i dalje spremni, jer preostaje da ih "potpisemo"
        // nekom nasom secret string informacijom. To radimo putem jwt.sign() metode:

        const token: string = jwt.sign(JwtData.toPlainObjectJWTdata(),jwtSecret); // we generate the token...


        const responseObject: loginAuthoInfo = new loginAuthoInfo(
            admin.administratorId,
            admin.username,
            token
        );
        
        return new Promise(resolve => { resolve(responseObject)});
    }

    //POST http://localhost:3000/auth/Administrator/login/user
    @Post('login/user')
    async doLoginUser(@Body() data: UseLoginDto, @Req() request:Request): Promise<loginAuthoInfo| ApiResponse> {
        
        const user: User = await this.userService.getByEmail(data.email);
        
        // provjera za username:
        if (user === null)
            return new Promise(resolve => resolve(new ApiResponse('error', -3001, 'Greska sa datim username-om')));
        
        // provjera za password:
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordString = passwordHash.digest('hex').toUpperCase();

        if (passwordString !== user.passwordHash) {
            return new Promise(resolve => resolve(new ApiResponse('error', -3002, 'Greska, netacna lozinka !')));
        }

        // ono sto zelimo da vratimo nije administrator sa svojim id, i ostalim detaljima vec,
        // objekat koji sadrzi: 
        /**
         * administratorId
         * username
         * TOKEN    (JWT JSONwebTOKEN)
         * token = JSON{ adminId, username, exp, ip, ua}, exp - datum isteka, ua - trenutni useragent
         * moramo instalirati jsonwebtoken
         * 
         * */
        const JwtData = new JwtDataDto();
        JwtData.role = "user";
        JwtData.Id = user.userId;
        JwtData.username = user.email;
        
        let temporaryTime = new Date(); // uzimamo trenutno vrijeme...
        temporaryTime.setDate(temporaryTime.getDate() + 14);// 14 days
        const expiredTime = temporaryTime.getTime() / 1000; // dijelimo i pretvaramo u sekunde
        
        JwtData.exp = expiredTime;

        // pristupamo ip adresi i useragent-u koji se nalaze u request dijelu :
        JwtData.ip = request.ip;
        //console.log("Ip address: " + JwtData.ip);
        JwtData.ua = request.headers["user-agent"].toString();
       // console.log("useragent-u: " + JwtData.ua);

        // podaci koje smo skupili u JwtData objektu za token nisu i dalje spremni, jer preostaje da ih "potpisemo"
        // nekom nasom secret string informacijom. To radimo putem jwt.sign() metode:

        const token: string = jwt.sign(JwtData.toPlainObjectJWTdata(),jwtSecret); // we generate the token...


        const responseObject: loginAuthoInfo = new loginAuthoInfo(
            user.userId,
            user.email,
            token
        );
        
        return new Promise(resolve => { resolve(responseObject)});
    }



    // POST http://localhost:3000/auth/Administrator/user/registration
    @Post('user/registration')
    async Registration(@Body() data: UserRegistrationDto, @Req() request: Request): Promise<User | ApiResponse> {
        return await this.userService.register(data);
    }
      
}