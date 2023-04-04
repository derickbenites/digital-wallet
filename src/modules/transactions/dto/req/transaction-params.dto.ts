import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeTransaction } from 'src/common/constants/type-transaction.constant';

export class TrasactionParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type: TypeTransaction;

  constructor(partial: Partial<TrasactionParamsDto>) {
    Object.assign(this, partial);
  }
}
