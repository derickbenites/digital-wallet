import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ShoppingService } from '../services/shopping.service';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('shopping')
@ApiTags('Shopping')
@ApiResponse({ status: 200 })
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Post()
  create(@Body() createShoppingDto: CreateShoppingDto) {
    return this.shoppingService.create(createShoppingDto);
  }

  @Get()
  findAll() {
    return this.shoppingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingService.remove(+id);
  }
}
