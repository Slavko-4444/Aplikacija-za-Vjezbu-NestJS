import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'output/entities/administrator.entity';
import { AddAdministratotDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministrator } from 'src/dtos/administrator/edit.administrator.dto';
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

    add(data: AddAdministratotDto): Promise<Administrator> {
        //DTO -> model
        //username -> username
        //password -> passwordhash
        // za hashiranje password-a koristicemo SHA512 iz vec osnovne biblioteke "crypto"
        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');

        passwordHash.update(data.password);
        const passwordString = passwordHash.digest('hex').uperCase();
        
        let newAdmin: Administrator = new Administrator();
        return this.administrator.save(newAdmin);

    }

    async editById(id: number, data: EditAdministrator): Promise<Administrator> {

        let admin: Administrator = await this.administrator.findOneById(id);
        
        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');

        passwordHash.update(data.password);
        const passwordString = passwordHash.digest('hex').uperCase();
        admin.passwordHash = passwordString;

        return this.administrator.save(admin);
    }

    // univerzalni za sve
    // add
    // editById
    // deleteById
}
