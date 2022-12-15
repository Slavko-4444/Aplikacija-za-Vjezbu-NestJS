import { AdministratorService } from "src/services/administrator/administrator.service";
import { Administrator } from "src/output/entities/administrator.entity";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { AddAdministratotDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministrator } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/msci/api.response.class";

@Controller('api/administrator')
export class AdministratorController { 
    
    constructor(
       private administratorService: AdministratorService
    ) { }
    
    // GET http://localhost:3000/api/administrator
    @Get()
    getAll(): Promise<Administrator[]> {
        return this.administratorService.getAll();
    }
    
    // GET http://localhost:3000/api/administrator/:id
    @Get(':id')
    getById(
        @Param('id')
        administratorId: number
    ): Promise<Administrator|ApiResponse> {
        // u slucaju da nepostoji admin sa datim id-om:
        
        return new Promise(async resolve => {
            const admin = await this.administratorService.getById(administratorId);
            if (admin === null) 
                resolve(new ApiResponse("error", -1002));
            resolve(admin);
        })
    }

    //PUT http://localhost:3000/api/administrator
    // anotacija @Body() nam predstavlja podatke iz requset-a klijenta, ili ovdje iz http put metode
    @Put()
    add(@Body() data: AddAdministratotDto) : Promise<Administrator| ApiResponse> {
        return this.administratorService.add(data);
    }

    // POST http://localhost:3000/api/administrator/id
    // koristimo za update podataka u entitetu
    @Post(':id')
    editById(@Param('id') id: number, @Body() data: EditAdministrator): Promise<Administrator|ApiResponse>{
        return this.administratorService.editById(id, data);
    }

}
