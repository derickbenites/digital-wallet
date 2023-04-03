import { ApiProperty } from '@nestjs/swagger';
import { ShoppingDto } from '../res/shopping.dto';

export class ShoppingPaginateDto {
  @ApiProperty({ isArray: true, type: ShoppingDto })
  items: ShoppingDto[];
}
