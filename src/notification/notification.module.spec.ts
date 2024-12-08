// src/notification/notification.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationScheduler } from './notification.scheduler';
import { PrismaService } from '../prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

describe('NotificationModule', () => {
   let service: NotificationService;
   let scheduler: NotificationScheduler;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [ScheduleModule.forRoot()],
         providers: [NotificationService, NotificationScheduler, PrismaService],
      }).compile();

      service = module.get<NotificationService>(NotificationService);
      scheduler = module.get<NotificationScheduler>(NotificationScheduler);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
      expect(scheduler).toBeDefined();
   });
});
