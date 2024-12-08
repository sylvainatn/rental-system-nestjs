import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
   constructor(private readonly customersService: CustomersService) { }

   @Get()
   async findAll() {
      return await this.customersService.findAll();
   }

   @Post()
   async create(@Body() body: { first_name: string; last_name: string; email: string; store_id: number; address_id: number }) {
      return await this.customersService.create(body);
   }

   @Put(':id')
   async update(
      @Param('id') id: string,
      @Body() body: { first_name: string; last_name: string; email: string },
   ) {
      return await this.customersService.update(parseInt(id, 10), body);
   }
}
