import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/req/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionDto } from '../dto/res/transaction.dto';
import { WalletsService } from 'src/modules/wallets/services/wallets.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { TypeTransaction } from 'src/common/constants/type-transaction.constant';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly usersService: UsersService,
    private readonly walletService: WalletsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    this.valideTransaction(createTransactionDto);
    this.walletService.updateBalance(createTransactionDto);
    const transaction = await this.saveTransaction(createTransactionDto);

    return new TransactionDto(transaction);
  }

  async saveTransaction(transaction: CreateTransactionDto) {
    if (
      transaction.action === TypeTransaction.PAYMENT ||
      transaction.action === TypeTransaction.WITHDRAW
    ) {
      transaction.valueTransaction = -transaction.valueTransaction;
    }
    return await this.transactionRepository.createTransaction(transaction);
  }

  async valideTransaction(dto: CreateTransactionDto) {
    this.usersService.valideUser(dto.userId);
    this.walletService.valideWallet(dto.walletId);
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
