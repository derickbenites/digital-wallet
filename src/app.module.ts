import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ShoppingModule } from './modules/shopping/shopping.module';
import { PaymentReversalModule } from './modules/payment-reversal/payment-reversal.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    WalletsModule,
    TransactionsModule,
    ShoppingModule,
    PaymentReversalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
