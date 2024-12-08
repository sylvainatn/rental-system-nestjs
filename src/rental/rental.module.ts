import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RentalController],
  providers: [RentalService, PrismaService],
})
export class RentalModule { }
