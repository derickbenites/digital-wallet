import { Module } from '@nestjs/common';
import { ShoppingService } from './services/shopping.service';
import { ShoppingController } from './controllers/shopping.controller';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService],
})
export class ShoppingModule {}
