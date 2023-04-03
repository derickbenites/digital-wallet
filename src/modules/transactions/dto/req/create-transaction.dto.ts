import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  valueTransaction: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  action: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  walletId: string;

  @IsDateString()
  @ApiProperty({ required: true })
  dateTransaction: Date;
}

export class ReqCreateTransactionDto {
  @Type(() => CreateTransactionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  reqCreateTransactionDto: CreateTransactionDto[];
}
