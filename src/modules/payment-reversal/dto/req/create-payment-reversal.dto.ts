import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentReversalDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  walletId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  transactionId: string;
}
