import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationService } from './notification.service';
import { NotificationScheduler } from './notification.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationController } from './notification.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
   imports: [PrismaModule, MailModule, ScheduleModule.forRoot()],
   providers: [NotificationService, NotificationScheduler],
   exports: [NotificationService],
   controllers: [NotificationController],
})
export class NotificationModule { }
