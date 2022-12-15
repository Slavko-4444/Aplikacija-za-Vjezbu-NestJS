import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/output/entities/administrator.entity';
import { AddAdministratotDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministrator } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/msci/api.response.class';
import { Repository } from 'typeorm';

@Injectable()
export class AdministratorService {

    constructor(
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>
    ) { }
    
    // vraca obecanje da ce kad-tad vratiti niz administratora...   
    getAll() : Promise<Administrator[]>{
        return this.administrator.find(); // funkcija typeorm-a,  upitanju je asinc funkcija
    }
    getById(id: number):Promise<Administrator> {
        return this.administrator.findOneById(id);  
    }

    async getByUsername(username: string): Promise<Administrator | null> {
        
        const admin : Administrator = await this.administrator.findOneBy({
            username: username
        });
         
        if (admin === undefined)
            return null;
        
        return admin;
    }
    add(data: AddAdministratotDto): Promise<Administrator | ApiResponse> {
        //DTO -> model
        //username -> username
        //password -> passwordhash
        // za hashiranje password-a koristicemo SHA512 iz vec osnovne biblioteke "crypto"
        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');

        passwordHash.update(data.password);
        const passwordString = passwordHash.digest('hex').toUpperCase();
        
        let newAdmin: Administrator = new Administrator();
        newAdmin.passwordHash = passwordString;
        newAdmin.username = data.username;

        return new Promise((resolve) => {
            this.administrator.save(newAdmin)
                .then(data => resolve(data))
                .catch(error => {
                     const response: ApiResponse = new ApiResponse("error", -1003, null);
                    return resolve(response);
                })
        })
    }

    async editById(id: number, data: EditAdministrator): Promise<Administrator | ApiResponse> {

        let admin: Administrator = await this.administrator.findOneById(id);  
        // u slucaju da ne postoji trazeni administrator vracamo promise <ApiResponse>
        if (admin === null) {
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -1002));
            })
        }
        
        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');

        passwordHash.update(data.password);
        const passwordString = passwordHash.digest('hex').toUpperCase();
        admin.passwordHash = passwordString;

        return this.administrator.save(admin);
    }

    // univerzalni za sve
    // add
    // editById
    // deleteById
}
