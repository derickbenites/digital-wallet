import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  constructor(partial: Partial<TransactionDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({ required: true })
  valueTransaction: string;

  @ApiProperty({ required: true })
  action: number;

  @ApiProperty({ required: true })
  walletId: string;

  @ApiProperty({ required: true })
  dateTransaction: Date;
}
