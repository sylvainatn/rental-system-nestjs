import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationScheduler } from './notification.scheduler';


@Controller('notification')
export class NotificationController {
   constructor(
      private readonly notificationService: NotificationService,
      private readonly notificationScheduler: NotificationScheduler,
   ) { }

   @Get('tasks')
   listScheduledTasks() {
      return {
         tasks: this.notificationScheduler.listScheduledTasks(),
      };
   }

   @Post('send')
   async sendNotifications(@Body('daysBeforeReturn') daysBeforeReturn: number) {
      if (!daysBeforeReturn) {
         throw new HttpException('daysBeforeReturn est requis.', HttpStatus.BAD_REQUEST);
      }

      try {
         await this.notificationService.sendNotifications(daysBeforeReturn);
         return { message: `Notifications pour J-${daysBeforeReturn} envoyées avec succès.` };
      } catch (error) {
         throw new HttpException(
            'Une erreur s\'est produite lors de l\'envoi des notifications.',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }
}
