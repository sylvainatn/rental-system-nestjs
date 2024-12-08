import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { RentalModule } from './rental/rental.module';
import { NotificationModule } from './notification/notification.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    CustomersModule,
    RentalModule,
    NotificationModule,
    MailModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
