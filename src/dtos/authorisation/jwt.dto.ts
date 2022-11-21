
export class JwtDataTransferObject { 
    administratorId: number; 
    username: string;
    exp: number;
    ip: string;
    ua: string;

    toPlainObjectJWTdata() {
        return {
            administratorId: this.administratorId,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }
}
