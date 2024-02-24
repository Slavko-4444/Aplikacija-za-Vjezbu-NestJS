import { Body, Controller, HttpException, HttpStatus, Post, Put, Req } from "@nestjs/common";
import { Administrator } from "src/output/entities/administrator.entity";
import { AuthorizationDto } from "src/dtos/authorisation/authorisation.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { loginAuthoInfo } from "src/dtos/authorisation/login.autho.info";
import * as jwt from "jsonwebtoken";
import { JwtDataDto } from "src/dtos/authorisation/jwt.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { User } from "src/output/entities/user.entity";
import { UserService } from "src/services/user/user.service";
import { UseLoginDto } from "src/dtos/user/user.login.dto";
import { JwtRefreshData } from "src/dtos/authorisation/jwt.refresh.dto";
import { UserRefreshTokenDto } from "src/dtos/authorisation/user.refresh.token.dto";
import { UserToken } from "src/output/entities/user-token.entity";
import { AdministratorToken } from "src/output/entities/administrator-token.entity";
import { AdministratorRefreshTokenDto } from "src/dtos/authorisation/administrator.refresh.token.dto";

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
         * moramo instalirati   
         * 
         * */
        const JwtData = new JwtDataDto();
        JwtData.role = "administrator";
        JwtData.Id = admin.administratorId;
        JwtData.identity = admin.username;
        
     
        JwtData.exp = this.getDAtePlus(60 * 5);//token admina traje 5 min

        // pristupamo ip adresi i useragent-u koji se nalaze u request dijelu :
        JwtData.ip = request.ip;
        //console.log("Ip address: " + JwtData.ip);
        JwtData.ua = request.headers["user-agent"].toString();
       // console.log("useragent-u: " + JwtData.ua);

        // podaci koje smo skupili u JwtData objektu za token nisu i dalje spremni, jer preostaje da ih "potpisemo"
        // nekom nasom secret string informacijom. To radimo putem jwt.sign() metode:

        const token: string = jwt.sign(JwtData.toPlainObjectJWTdata(),jwtSecret); // we generate the token...


        const jwtRefreshData = new JwtRefreshData();

        jwtRefreshData.Id = JwtData.Id;
        jwtRefreshData.role = JwtData.role;
        jwtRefreshData.ip = JwtData.ip;
        jwtRefreshData.ua = JwtData.ua;
        jwtRefreshData.identity = JwtData.identity;
        jwtRefreshData.exp = this.getDAtePlus(60 * 60);//refresh token za 1h

        const refreshToken: string = jwt.sign(jwtRefreshData.toPlainObjectJWTRefreshdata(), jwtSecret);

        const responseObject: loginAuthoInfo = new loginAuthoInfo(
            admin.administratorId,
            admin.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp)
        );
        

        await this.userService.addToken(
            admin.administratorId,
            refreshToken,
            this.getDataBaseDateFormat(this.getIsoDate(jwtRefreshData.exp))
        )
        
        return new Promise(resolve => { resolve(responseObject)});
    }

     // POST http://localhost:3000/auth/Administrator/admin/refresh
     @Post('administrator/refresh')
     async AdminTokenRefresh(@Req() req: Request, @Body() data: AdministratorRefreshTokenDto): Promise<loginAuthoInfo | ApiResponse> {
         
         const AdminToken: AdministratorToken = await this.administratorService.getAdministratorToken(data.token)
 
         if (!AdminToken)
             return new ApiResponse('error', -10004, 'No such refresh token.')
         
         if (AdminToken.isValid === 0)
             return new ApiResponse('error', -10005, 'Refresh token is no  longer valid.')
             
         const sada = new Date();
         const datumIsteka = new Date(AdminToken.expiresAt);
         
         if ( datumIsteka.getTime() < sada.getTime())
             return new ApiResponse('error', -10006, 'Refresh token is expired')
 
         
         let jwtRefreshData: JwtRefreshData = new JwtRefreshData();
         // cisto da provjerimo ako je token nekorektan
         try {
             jwtRefreshData = jwt.verify(data.token, jwtSecret);
             
         } catch (error) {
             throw new HttpException("Nekorektan token error massage => " + error, HttpStatus.UNAUTHORIZED);
         }
 
         if (!jwtRefreshData)
         throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
         
         if (req.ip !== jwtRefreshData.ip)
         throw new HttpException('Bad ip address was found', HttpStatus.UNAUTHORIZED);
            
         if (req.headers["user-agent"].toString() !== jwtRefreshData.ua)
             throw new HttpException('Bad user-agent was bad', HttpStatus.UNAUTHORIZED);
      
         const jwtData: JwtDataDto = new JwtDataDto();
 
         jwtData.Id       = jwtRefreshData.Id;
         jwtData.role     = jwtRefreshData.role;
         jwtData.ip       = jwtRefreshData.ip;
         jwtData.ua       = jwtRefreshData.ua;
         jwtData.identity = jwtRefreshData.identity;
         jwtData.exp      = this.getDAtePlus(60 * 5);
         
         let NewToken: string = jwt.sign(jwtData.toPlainObjectJWTdata(), jwtSecret);
 
         return new loginAuthoInfo(
             jwtData.Id,
             jwtData.identity,
             NewToken,
             data.token,
             this.getIsoDate(jwtRefreshData.exp)
         );
     }

    //POST http://localhost:3000 
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
        JwtData.identity = user.email;
        
        // let temporaryTime = new Date(); // uzimamo trenutno vrijeme...
        // temporaryTime.setDate(temporaryTime.getDate() + 14);// 14 days
        // const expiredTime = temporaryTime.getTime() / 1000; // dijelimo i pretvaramo u sekunde
        
        JwtData.exp = this.getDAtePlus(60 * 5); // token traje 5 min

        // pristupamo ip adresi i useragent-u koji se nalaze u request dijelu :
        JwtData.ip = request.ip;
        //console.log("Ip address: " + JwtData.ip);
        JwtData.ua = request.headers["user-agent"].toString();
       // console.log("useragent-u: " + JwtData.ua);

        // podaci koje smo skupili u JwtData objektu za token nisu i dalje spremni, jer preostaje da ih "potpisemo"
        // nekom nasom secret string informacijom. To radimo putem jwt.sign() metode:

        const token: string = jwt.sign(JwtData.toPlainObjectJWTdata(),jwtSecret); // we generate the token...

        const jwtRefreshData = new JwtRefreshData();

        jwtRefreshData.Id = JwtData.Id;
        jwtRefreshData.role = JwtData.role;
        jwtRefreshData.ip = JwtData.ip;
        jwtRefreshData.ua = JwtData.ua;
        jwtRefreshData.identity = JwtData.identity;
        jwtRefreshData.exp = this.getDAtePlus(60 * 60);//refresh token za 1h

        const refreshToken: string = jwt.sign(jwtRefreshData.toPlainObjectJWTRefreshdata(), jwtSecret);

        const responseObject: loginAuthoInfo = new loginAuthoInfo(
            user.userId,
            user.email,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp)
        );
        

        await this.userService.addToken(
            user.userId,
            refreshToken,
            this.getDataBaseDateFormat(this.getIsoDate(jwtRefreshData.exp))
        )

        return new Promise(resolve => { resolve(responseObject)});
    }



    // POST http://localhost:3000/auth/Administrator/user/registration
    @Post('user/registration')
    async Registration(@Body() data: UserRegistrationDto, @Req() request: Request): Promise<User | ApiResponse> {
        return await this.userService.register(data); 
    }
 
    // POST http://localhost:3000/auth/Administrator/user/refresh
    @Post('user/refresh')
    async userTokenRefresh(@Req() req: Request, @Body() data: UserRefreshTokenDto): Promise<loginAuthoInfo | ApiResponse> {
        
        const userToken: UserToken = await this.userService.getUserToken(data.token)

        if (!userToken)
            return new ApiResponse('error', -10004, 'No such refresh token.')
        
        if (userToken.isValid === 0)
            return new ApiResponse('error', -10005, 'Refresh token is no  longer valid.')
            
        const sada = new Date();
        const datumIsteka = new Date(userToken.expiresAt);
        
        if ( datumIsteka.getTime() < sada.getTime())
            return new ApiResponse('error', -10006, 'Refresh token is expired')

        
        let jwtRefreshData: JwtRefreshData = new JwtRefreshData();
        // cisto da provjerimo ako je token nekorektan
        try {
            jwtRefreshData = jwt.verify(data.token, jwtSecret);
            
        } catch (error) {
            throw new HttpException("Nekorektan token error massage => " + error, HttpStatus.UNAUTHORIZED);
        }

        if (!jwtRefreshData)
        throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        
        if (req.ip !== jwtRefreshData.ip)
        throw new HttpException('Bad ip address was found', HttpStatus.UNAUTHORIZED);
           
        if (req.headers["user-agent"].toString() !== jwtRefreshData.ua)
            throw new HttpException('Bad user-agent was bad', HttpStatus.UNAUTHORIZED);
     
        const jwtData: JwtDataDto = new JwtDataDto();

        jwtData.Id       = jwtRefreshData.Id;
        jwtData.role     = jwtRefreshData.role;
        jwtData.ip       = jwtRefreshData.ip;
        jwtData.ua       = jwtRefreshData.ua;
        jwtData.identity = jwtRefreshData.identity;
        jwtData.exp      = this.getDAtePlus(60 * 5);
        
        let NewToken: string = jwt.sign(jwtData.toPlainObjectJWTdata(), jwtSecret);

        return new loginAuthoInfo(
            jwtData.Id,
            jwtData.identity,
            NewToken,
            data.token,
            this.getIsoDate(jwtRefreshData.exp)
        );
    }
     



    private getDAtePlus(numberOfSec: number) {
        let now = new Date();
        now = new Date(now.getTime());
        return now.getTime() / 1000 + numberOfSec;
    }

    private getIsoDate(timestamp: number) {

        const date = new Date();

        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    private getDataBaseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0, 19).replace('T', ' ');
    }


    private  dateToMySqlFormat(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    private mySqlToDate(mysqlDate) {
        const dateParts = mysqlDate.split(" ");
        const date = dateParts[0];
        const time = dateParts[1];
        const dateValues = date.split("-");
        const year = dateValues[0];
        const month = dateValues[1] - 1;
        const day = dateValues[2];
        const timeValues = time.split(":");
        const hour = timeValues[0];
        const minute = timeValues[1];
        const second = timeValues[2];
        return new Date(year, month, day, hour, minute, second);
      }
}