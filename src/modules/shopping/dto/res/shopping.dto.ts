import { ApiProperty } from '@nestjs/swagger';

export class ShoppingDto {
  constructor(partial: Partial<ShoppingDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({ required: true })
  walletId: string;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty({ required: true })
  createdAt: Date;
}
