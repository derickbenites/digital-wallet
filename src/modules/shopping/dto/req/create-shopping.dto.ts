import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShoppingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  walletId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  price: number;
}
