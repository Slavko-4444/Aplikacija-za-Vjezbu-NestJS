
export class loginAuthoInfo {
    Id: number;
    identity: string;
    token: string;
    refreshToken: string;
    expiresAt: string;

    constructor(id: number, ident: string, jwt: string, refreshToken: string, expiresAt: string) {
        this.Id = id;
        this.identity = ident;
        this.token = jwt;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }
}