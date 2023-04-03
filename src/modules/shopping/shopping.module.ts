import { Module } from '@nestjs/common';
import { ShoppingService } from './services/shopping.service';
import { ShoppingController } from './controllers/shopping.controller';
import { ShoppingRepository } from './repositories/shopping.repository';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService, ShoppingRepository],
})
export class ShoppingModule {}
