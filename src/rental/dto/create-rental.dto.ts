import { IsNotEmpty, IsDateString, IsInt } from 'class-validator';

export class CreateRentalDto {
   @IsInt()
   @IsNotEmpty()
   customerId: number;

   @IsInt()
   @IsNotEmpty()
   filmId: number;

   @IsDateString()
   @IsNotEmpty()
   rentalDate: string;

   @IsDateString()
   @IsNotEmpty()
   returnDate: string;
}
