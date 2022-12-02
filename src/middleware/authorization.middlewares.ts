import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'config/jwt.secret';
import { JwtDataTransferObject } from 'src/dtos/authorisation/jwt.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    
    constructor(private adminisistrationService: AdministratorService)
    { }

    async use(req: Request, res: Response, next: NextFunction ) {

        if (!req.headers.authorization) 
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        
        // posto cem token automacki unositi iz postman-a onda cemo odvojiti 'Bearer ' koji se automacki dodaje 
        let TokenParts = req.headers.authorization.split(' ');        
        const token = TokenParts[1];

        // istim podpisom nasim, iz tokena uzimamo informacije koje bi trebale da se nalaze, jer smo ih prosli put
        // u tokenu enkriptovali...
        //provjeravamo sve njih:
        let jwtData: JwtDataTransferObject = new JwtDataTransferObject();
        // cisto da provjerimo ako je token ne korektan
        try {
            jwtData = jwt.verify(token, jwtSecret);
            
        } catch (error) {
            throw new HttpException("Nekorektan token error massage => "+error, HttpStatus.UNAUTHORIZED);
        }

        if (!jwtData)
        throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        
       // console.log("Ip "+req.ip);
        if (req.ip !== jwtData.ip)
        throw new HttpException('Bad ip address was found', HttpStatus.UNAUTHORIZED);

        if (req.headers["user-agent"].toString() !== jwtData.ua)
            throw new HttpException('Bad user-agent was bad', HttpStatus.UNAUTHORIZED);
        
        const administrator = await this.adminisistrationService.getById(jwtData.administratorId);
        if (!administrator) 
            throw new HttpException('Bad administrator was bad', HttpStatus.UNAUTHORIZED);
        
        let temporaryTime = (new Date()).getTime() / 1000; 
       
        if (jwtData.exp <= temporaryTime)
            throw new HttpException('Token has expired!', HttpStatus.UNAUTHORIZED);
        
        //console.log(jwtData); 
        next();
    }
}