import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ShoppingService } from '../services/shopping.service';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShoppingDto } from '../dto/res/shopping.dto';
import { ShoppingPaginateDto } from '../dto/res/shopping-paginate.dto';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';

@Controller('shopping')
@ApiTags('Shopping')
@ApiResponse({ status: 200 })
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @ApiOperation({ operationId: 'createShopping' })
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ShoppingDto })
  create(@Body() createShoppingDto: CreateShoppingDto) {
    return this.shoppingService.create(createShoppingDto);
  }

  @ApiOperation({ operationId: 'allShopping' })
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ShoppingPaginateDto })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.shoppingService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingService.remove(id);
  }
}
