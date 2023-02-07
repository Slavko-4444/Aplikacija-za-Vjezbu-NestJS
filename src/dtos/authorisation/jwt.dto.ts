
export class JwtDataDto { 
    role: "administrator" | "user";
    Id: number; 
    username: string;
    exp: number;
    ip: string;
    ua: string;

    toPlainObjectJWTdata() {
        return {
            role: this.role,
            Id: this.Id,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }
}
