import { ApiProperty } from '@nestjs/swagger';

export class WalletDto {
  constructor(partial: Partial<WalletDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({ required: true })
  balance: number;
}
