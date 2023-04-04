import { Module } from '@nestjs/common';
import { ShoppingService } from './services/shopping.service';
import { ShoppingController } from './controllers/shopping.controller';
import { ShoppingRepository } from './repositories/shopping.repository';
import { TransactionsService } from '../transactions/services/transactions.service';
import { WalletsService } from '../wallets/services/wallets.service';
import { TransactionRepository } from '../transactions/repositories/transaction.repository';
import { WalletsRepository } from '../wallets/repositories/wallet.repository';
import { UsersService } from '../users/services/users.service';
import { UsersRepository } from '../users/repositories/users.repository';
import { PaymentReversalService } from '../payment-reversal/services/payment-reversal.service';
import { PaymentReversalRepository } from '../payment-reversal/repositories/payment-reversal.repository';

@Module({
  controllers: [ShoppingController],
  providers: [
    ShoppingService,
    ShoppingRepository,
    TransactionsService,
    TransactionRepository,
    WalletsService,
    WalletsRepository,
    UsersService,
    UsersRepository,
    PaymentReversalService,
    PaymentReversalRepository,
  ],
})
export class ShoppingModule {}
