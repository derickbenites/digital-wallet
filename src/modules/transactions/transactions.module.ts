import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { WalletsRepository } from '../wallets/repositories/wallet.repository';
import { UsersService } from '../users/services/users.service';
import { WalletsService } from '../wallets/services/wallets.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
    UsersService,
    UsersRepository,
    WalletsService,
    WalletsRepository,
  ],
})
export class TransactionsModule {}
