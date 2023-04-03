import { ApiProperty } from '@nestjs/swagger';

export class PaymentReversalDto {
  constructor(partial: Partial<PaymentReversalDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({ required: true })
  walletId: string;

  @ApiProperty({ required: true })
  transactionId: string;
}
