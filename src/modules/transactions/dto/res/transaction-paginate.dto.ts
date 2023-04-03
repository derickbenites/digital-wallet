import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class TransactionPaginateDto {
  @ApiProperty({ isArray: true, type: TransactionDto })
  items: TransactionDto[];
}
