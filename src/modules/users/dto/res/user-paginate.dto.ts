import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserPaginateDto {
  @ApiProperty({ isArray: true, type: UserDto })
  items: UserDto[];
}
