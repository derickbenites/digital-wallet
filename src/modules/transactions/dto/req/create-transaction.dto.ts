import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TypeTransaction } from 'src/common/constants/type-transaction.constant';

export class CreateTransactionDto {
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
  valueTransaction: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  action: TypeTransaction;
}

export class ReqCreateTransactionDto {
  @Type(() => CreateTransactionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  reqCreateTransactionDto: CreateTransactionDto[];
}
