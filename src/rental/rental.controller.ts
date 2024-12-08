import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';

@Controller('rental')
export class RentalController {
   constructor(private readonly rentalService: RentalService) { }

   @Post()
   async createRental(@Body() createRentalDto: CreateRentalDto) {
      try {
         const rental = await this.rentalService.createRental(createRentalDto);
         return { message: 'Location effectuée avec succès.', rental };
      } catch (error) {
         if (error.code === 'P2002') {
            throw new HttpException('Conflit avec une contrainte unique.', HttpStatus.CONFLICT);
         }
         throw new HttpException(error.message || 'Erreur serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
