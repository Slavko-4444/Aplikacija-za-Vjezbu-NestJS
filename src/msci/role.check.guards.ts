import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";


@Injectable()
export class RoleCheckedGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    
        // ture - odobravanje izvrsavanja metode
        // false - ne odobravanje izvrsavanja metode

        const req: Request = context.switchToHttp().getRequest();
        const role = req.token.role;
        
        const AllowedRoles = this.reflector.get<("administrator" | "user")[]>('allow_to_roles', context.getHandler());
        
        if (!AllowedRoles.includes(role))
            return false;
        
        return true;
    } 
    
}