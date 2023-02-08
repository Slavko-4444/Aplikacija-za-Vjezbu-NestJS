import { JwtDataDto } from "src/dtos/authorisation/jwt.dto";
 
declare module 'express' {
    interface Request {
        token: JwtDataDto
    }
}