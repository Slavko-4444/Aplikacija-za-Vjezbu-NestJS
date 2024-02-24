import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'config/jwt.secret';
import { JwtDataDto } from 'src/dtos/authorisation/jwt.dto';
import { UserService } from 'src/services/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    
    constructor(private adminisistrationService: AdministratorService, private userService: UserService)
    { }

    async use(req: Request, res: Response, next: NextFunction ) {

        if (!req.headers.authorization) 
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        
        // posto cemo token automacki unositi iz postman-a onda cemo odvojiti 'Bearer' koji se automacki dodaje 
        let TokenParts = req.headers.authorization.split(' ');        
        const token = TokenParts[1];

        // istim podpisom nasim, iz tokena uzimamo informacije koje bi trebale da se nalaze, jer smo ih prosli put
        // u tokenu enkriptovali...
        //provjeravamo sve njih:
        let jwtData: JwtDataDto = new JwtDataDto();
        // cisto da provjerimo ako je token nekorektan
        try {
            jwtData = jwt.verify(token, jwtSecret);
            
        } catch (error) {
            throw new HttpException("Nekorektan token error massage => " + error, HttpStatus.UNAUTHORIZED);
        }

        if (!jwtData)
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        
       // console.log("Ip "+req.ip);
        if (req.ip !== jwtData.ip)
        throw new HttpException('Bad ip address was found', HttpStatus.UNAUTHORIZED);
        
        if (req.headers["user-agent"].toString() !== jwtData.ua)
            throw new HttpException('Bad user-agent was bad', HttpStatus.UNAUTHORIZED);
        
        
        if (jwtData.role === "administrator") {
            const administrator = await this.adminisistrationService.getById(jwtData.Id);
            if (!administrator) 
                throw new HttpException('This account cannot be found.', HttpStatus.UNAUTHORIZED);
            }
            else if (jwtData.role === "user") {
                const user = await this.userService.getById(jwtData.Id);
                if (!user) 
                    throw new HttpException('This account cannot be found.', HttpStatus.UNAUTHORIZED);
            
        }
        
        let temporaryTime = (new Date()).getTime() / 1000; 
       
        if (jwtData.exp <= temporaryTime)
            throw new HttpException('Token has expired!', HttpStatus.UNAUTHORIZED);
        
        
        req.token = jwtData; // uz prosirenu http request doveden putem express-a mi proslijedjujemo u roleGuard otpakovan token
        // console.log(jwtData); 
        next();
    }
}