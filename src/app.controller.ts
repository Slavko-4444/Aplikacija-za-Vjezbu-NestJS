import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {
  @Get() //http://loalhost:3000/
  getHello(): string {
    return 'Hello';
  }
  @Get('world') // http://loalhost:3000/world/
  getWorld(): string {
    return 'World!';
  }
}
