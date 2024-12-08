// src/notification/notification.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationService {
   constructor(
      private readonly prisma: PrismaService,
      private readonly mailService: MailService,
   ) { }

   async sendNotifications(daysBeforeReturn: number) {
      try {
         const targetDate = new Date();
         targetDate.setDate(targetDate.getDate() + daysBeforeReturn);

         console.log('Date ciblé : ', targetDate.toDateString());

         const rentals = await this.prisma.rental.findMany({
            where: {
               return_date: {
                  gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                  lt: new Date(targetDate.setHours(23, 59, 59, 999)),
               },
            },
            include: {
               customer: true,
               inventory: {
                  include: { film: true },
               },
            },
         });

         console.log('Locations trouvée : ', rentals.length);

         for (const rental of rentals) {
            const { customer, inventory, return_date } = rental;
            const film = inventory.film;

            if (!return_date || !customer.email) {
               continue;
            }

            const subject = `Rappel : Retour de votre film "${film.title}"`;
            const message = `Cher(e) ${customer.first_name},\n\n` +
               `           Votre location du film "${film.title}" arrive à échéance le ${return_date.toDateString()}.\n` +
               `           Merci de retourner le film à temps pour éviter toute pénalité.\n\n` +
               `           Cordialement\n` +
               `           Votre équipe de location.`;

            await this.mailService.sendMail(customer.email, subject, message);
         }
      } catch (error) {
         console.error(error);
         throw new HttpException('Une erreur s\'est produite lors de l\'envoi des rappels.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
