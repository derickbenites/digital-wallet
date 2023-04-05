import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { UserDto } from '../dto/res/user.dto';
import { UserPaginateDto } from '../dto/res/user-paginate.dto';

@Controller('users')
@ApiTags('Users')
@ApiResponse({ status: 200 })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ operationId: 'createUser' })
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ operationId: 'allUsers' })
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserPaginateDto })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.usersService.findAll(pageOptionsDto);
  }

  @ApiOperation({ operationId: 'updateUser' })
  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ operationId: 'deleteUser' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
