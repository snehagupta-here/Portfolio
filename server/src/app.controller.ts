import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller('health-check')
export class ContactUsController {
    constructor(
        private readonly appService : AppService
    ){}
    @Get()
    healthCheck(){
        return this.appService.healthCheck();
    }
}
