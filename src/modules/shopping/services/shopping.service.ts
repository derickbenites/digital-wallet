import { Injectable } from '@nestjs/common';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingRepository } from '../repositories/shopping.repository';
import { ShoppingDto } from '../dto/res/shopping.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingRepository)
    private readonly shoppingRepository: ShoppingRepository,
  ) {}

  async create(createShoppingDto: CreateShoppingDto) {

    //needs implement roles about register shopping
    const shopping = await this.shoppingRepository.createShopping(
      createShoppingDto,
    );
    return new ShoppingDto(shopping);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    //needs implement roles about register shopping walletId/userId
    const shopping = await this.shoppingRepository.findAllShopping(
      pageOptionsDto,
    );

    return {
      ...shopping,
      items: shopping.items.map((item) => new ShoppingDto(item)),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} shopping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopping`;
  }
}
