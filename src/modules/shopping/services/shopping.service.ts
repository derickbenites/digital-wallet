import { Injectable } from '@nestjs/common';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';

@Injectable()
export class ShoppingService {
  create(createShoppingDto: CreateShoppingDto) {
    return 'This action adds a new shopping';
  }

  findAll() {
    return `This action returns all shopping`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopping`;
  }
}
