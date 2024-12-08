import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
   constructor(private prisma: PrismaService) { }

   private errorMessages = {
      genericError: 'Une erreur s\'est produite lors de l\'opération.',
      clientExists: 'Un client avec cet email existe déjà.',
      missingFields: 'Tous les champs (first_name, last_name, email, store_id, address_id) sont requis.',
      clientNotFound: 'Client non trouvé.',
      emailInUse: 'Un autre client possède déjà cet email.',
   };

   async findAll() {
      try {
         return await this.prisma.customer.findMany();
      } catch (error) {
         throw new InternalServerErrorException(this.errorMessages.genericError);
      }
   }

   async create(data: { first_name: string; last_name: string; email: string; store_id: number; address_id: number }) {
      const { first_name, last_name, email, store_id, address_id } = data;

      if (!first_name || !last_name || !email || !store_id || !address_id) {
         throw new BadRequestException(this.errorMessages.missingFields);
      }

      const existingCustomer = await this.prisma.customer.findUnique({ where: { email } });

      if (existingCustomer) {
         throw new BadRequestException(this.errorMessages.clientExists);
      }

      try {
         return await this.prisma.customer.create({
            data: {
               first_name,
               last_name,
               email,
               store_id,
               address_id,
               activebool: true,
               create_date: new Date(),
            },
         });
      } catch (error) {
         throw new InternalServerErrorException(this.errorMessages.genericError);
      }
   }

   async update(customer_id: number, data: { first_name: string; last_name: string; email: string }) {
      const { first_name, last_name, email } = data;

      if (!first_name || !last_name || !email) {
         throw new BadRequestException('Les champs first_name, last_name et email sont requis pour la mise à jour.');
      }

      const existingCustomerWithEmail = await this.prisma.customer.findUnique({ where: { email } });

      if (existingCustomerWithEmail && existingCustomerWithEmail.customer_id !== customer_id) {
         throw new BadRequestException(this.errorMessages.emailInUse);
      }

      try {
         return await this.prisma.customer.update({
            where: { customer_id },
            data: {
               first_name,
               last_name,
               email,
            },
         });
      } catch (error) {
         if (error.code === 'P2025') { // Prisma 'Record not found' error
            throw new NotFoundException(this.errorMessages.clientNotFound);
         }
         throw new InternalServerErrorException(this.errorMessages.genericError);
      }
   }
}
