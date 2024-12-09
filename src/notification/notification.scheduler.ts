/* 
3. Deux tâches planifiées doivent être mises en place :

- Une tâche planifiée qui envoie un email à J-5 à 12h00 avant la date de retour de chaque location.
- Une tâche planifiée qui envoie un email à J-3 à 12h00 avant la date de retour de chaque location.
*/

import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
   private readonly logger = new Logger(NotificationScheduler.name);

   constructor(
      private readonly notificationService: NotificationService,
      private readonly schedulerRegistry: SchedulerRegistry,
   ) { }

   @Cron('0 12 * * *', { name: 'sendNotificationsFiveDaysBefore', timeZone: 'Europe/Paris' })
   async sendNotificationsFiveDaysBefore() {
      this.logger.log('Exécution des notifications pour J-5 à 12:00.');
      await this.notificationService.sendNotifications(5);
   }

   @Cron('0 12 * * *', { name: 'sendNotificationsThreeDaysBefore', timeZone: 'Europe/Paris' })
   async sendNotificationsThreeDaysBefore() {
      this.logger.log('Exécution des notifications pour J-3 à 12:00.');
      await this.notificationService.sendNotifications(3);
   }

   listScheduledTasks(): string[] {
      const tasks = this.schedulerRegistry.getCronJobs();
      return Array.from(tasks.keys());
   }
}
