import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'output/entities/administrator.entity';
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

    // univerzalni za sve
    // add
    // editById
    // deleteById
}
