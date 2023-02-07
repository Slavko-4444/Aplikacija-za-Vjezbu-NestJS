
export class loginAuthoInfo {
    Id: number;
    identity: string;
    token: string;

    constructor(id: number, ident: string, jwt: string) {
        this.Id = id;
        this.identity = ident;
        this.token = jwt;
    }
}