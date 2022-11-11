import { Controller, Get } from '@nestjs/common';
import { Administrator } from '../../output/entities/administrator.entity';
import { AdministratorService } from '../services/administrator/administrator.service';


@Controller()
export class AppController {
  constructor(
    private administratorService: AdministratorService
  ){  }
  @Get() //http://loalhost:3000/
  getHello(): string {
    return 'Hello';
  }
  @Get('world') // http://loalhost:3000/world/
  getWorld(): string {
    return 'World!';
  }
  @Get('srbia')
  getSrbija(): string {
    return 'Srbija';
  }

  // @Get('api/administrator') //http://localhost:3000/api/administrator
  // getAllAdmins(): Promise<Administrator[]> {
  //   return this.administratorService.getAll();
  // }
  
}
