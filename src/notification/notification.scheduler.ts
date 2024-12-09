/* 
3. Deux tâches planifiées doivent être mises en place :

- Une tâche planifiée qui envoie un email à J-5 à 12h00 avant la date de retour de chaque location.
- Une tâche planifiée qui envoie un email à J-3 à 12h00 avant la date de retour de chaque location.
*/

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
   constructor(private readonly notificationService: NotificationService) { }

   @Cron('0 12 * * *', { timeZone: 'Europe/Paris' })
   async sendNotificationsFiveDaysBefore() {
      console.log('Exécution des notifications pour J-5 à 12:00.');
      await this.notificationService.sendNotifications(5);
   }

   @Cron('0 12 * * *', { timeZone: 'Europe/Paris' })
   async sendNotificationsThreeDaysBefore() {
      console.log('Exécution des notifications pour J-3 à 12:00.');
      await this.notificationService.sendNotifications(3);
   }
}
