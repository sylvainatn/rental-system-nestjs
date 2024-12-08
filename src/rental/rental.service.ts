import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';

@Injectable()
export class RentalService {
   constructor(private readonly prisma: PrismaService) { }

   async createRental(createRentalDto: CreateRentalDto) {
      const { customerId, filmId, rentalDate, returnDate } = createRentalDto;

      const rentalStartDate = new Date(rentalDate);
      const rentalEndDate = new Date(returnDate);

      // Validation des dates
      if (isNaN(rentalStartDate.getTime()) || isNaN(rentalEndDate.getTime())) {
         throw new HttpException('Le format de la date est invalide. Utilisez le format YYYY-MM-DD HH:MM:SS.', HttpStatus.BAD_REQUEST);
      }

      // Validation de la durée minimale et maximale des locations
      const minDuration = 7;
      const maxDuration = 21;
      const rentalDuration = (rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24);

      if (rentalDuration < minDuration) {
         throw new HttpException(`La durée minimale d'une location est de ${minDuration} jours.`, HttpStatus.BAD_REQUEST);
      }
      if (rentalDuration > maxDuration) {
         throw new HttpException(`La durée maximale d'une location est de ${maxDuration} jours.`, HttpStatus.BAD_REQUEST);
      }

      // Vérification de l'existence du film
      const film = await this.prisma.film.findUnique({
         where: { film_id: filmId },
      });

      if (!film) {
         throw new HttpException('Film non trouvé.', HttpStatus.NOT_FOUND);
      }

      // Vérification de la disponibilité dans l'inventaire
      const inventory = await this.prisma.inventory.findFirst({
         where: {
            film_id: film.film_id,
            rental: {
               none: {
                  return_date: {
                     gte: rentalStartDate,
                  },
               },
            },
         },
      });
      if (!inventory) {
         throw new HttpException('Film non disponible pour les dates sélectionnées.', HttpStatus.NOT_FOUND);
      }

      // Vérification de l'existence du client
      const customer = await this.prisma.customer.findUnique({
         where: { customer_id: customerId },
      });
      if (!customer || !customer.active) {
         throw new HttpException('Client non trouvé ou inactif.', HttpStatus.NOT_FOUND);
      }

      // Création de la location
      const rental = await this.prisma.rental.create({
         data: {
            customer_id: customer.customer_id,
            inventory_id: inventory.inventory_id,
            rental_date: rentalStartDate,
            return_date: rentalEndDate,
            staff_id: 1,
         },
      });

      await this.prisma.inventory.update({
         where: { inventory_id: inventory.inventory_id },
         data: { last_update: new Date() },
      });

      return rental;
   }
}
