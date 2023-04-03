import { ApiProperty } from '@nestjs/swagger';
import { PaymentReversalDto } from './payment-reversal.dto';

export class PaymentReversalPaginateDto {
  @ApiProperty({ isArray: true, type: PaymentReversalDto })
  items: PaymentReversalDto[];
}
