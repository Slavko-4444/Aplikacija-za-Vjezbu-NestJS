import { Body, Controller, Post, Req } from "@nestjs/common";
import { Administrator } from "output/entities/administrator.entity";
import { AuthorizationDto } from "src/dtos/authorisation/authorisation.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { loginAuthoInfo } from "src/dtos/authorisation/login.autho.info";
import * as jwt from "jsonwebtoken";
import { JwtDataTransferObject } from "src/dtos/authorisation/jwt.dto";
import { Request } from "express";
import { request } from "https";
import { jwtSecret } from "config/jwt.secret";

@Controller('auth/Administrator')
export class AuthController {

    constructor(public administratorService: AdministratorService)
    { }

    //POST http://localhost:3000/auth/Administrator/login
    @Post('login')
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
        const JwtData = new JwtDataTransferObject();
        JwtData.administratorId = admin.administratorId;
        JwtData.username = admin.username;
        
        let temporaryTime = new Date(); // uzimamo trenutno vrijeme...
        temporaryTime.setDate(temporaryTime.getDate() + 14);// 14 days
        const expiredTime = temporaryTime.getTime() / 1000; // dijelimo i pretvaramo u sekunde
        
        JwtData.exp = expiredTime;

        // pristupamo ip adresi i useragent-u koji se nalaze u request dijelu :
        JwtData.ip = request.ip;
        console.log("Ip address: " + JwtData.ip);
        JwtData.ua = request.headers["user-agent"].toString();
        console.log("useragent-u: " + JwtData.ua);

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
}