import { ApiProperty } from '@nestjs/swagger';
import { WalletDto } from './wallet.dto';

export class WalletPaginateDto {
  @ApiProperty({ isArray: true, type: WalletDto })
  items: WalletDto[];
}
