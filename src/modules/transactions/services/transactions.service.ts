import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/req/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionDto } from '../dto/res/transaction.dto';
import { WalletsService } from '../../../modules/wallets/services/wallets.service';
import { UsersService } from '../../../modules/users/services/users.service';
import { TypeTransaction } from '../../../common/constants/type-transaction.constant';
import { TrasactionParamsDto } from '../dto/req/transaction-params.dto';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { EntityManager } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly usersService: UsersService,
    private readonly walletService: WalletsService,
  ) {}

  async create(createTransactionDto: Array<CreateTransactionDto>) {
    try {
      return await this.transactionRepository.manager.transaction(
        async (entityManager) => {
          const result: Array<TransactionEntity> = [];
          for (const transaction of createTransactionDto) {
            this.valideTransaction(transaction);
            await this.walletService.updateBalance(transaction, entityManager);
            result.push(await this.saveTransaction(transaction, entityManager));
          }
          return result;
        },
      );
    } catch (error) {
      console.error(
        JSON.stringify({ context: this.create.name, message: error }),
      );

      throw new HttpException(
        {
          message: error.message,
          status: false,
          status_code: error.status_code || 4000,
        },
        error.status,
      );
    }
  }

  async saveTransaction(
    transaction: CreateTransactionDto,
    entityManager: EntityManager,
  ) {
    if (
      transaction.action === TypeTransaction.PAYMENT ||
      transaction.action === TypeTransaction.WITHDRAW
    ) {
      transaction.valueTransaction = -transaction.valueTransaction;
    }
    return await this.transactionRepository.createTransaction(
      transaction,
      entityManager,
    );
  }

  async valideTransaction(dto: CreateTransactionDto) {
    await this.usersService.valideUser(dto.userId);
    await this.walletService.valideWallet(dto.walletId);
    await this.valideDuplicade(dto);
  }

  async valideDuplicade(dto: CreateTransactionDto) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId: dto.userId,
        walletId: dto.walletId,
        valueTransaction: dto.valueTransaction,
        action: dto.action,
      },
      order: { createdAt: 'DESC' },
    });

    if (transactions.length > 0) {
      const current = new Date().getTime();

      const minTransactions = new Date(
        Date.parse(transactions[0].createdAt + '+0000'),
      ).getTime();

      const verify = Math.floor((current - minTransactions) / 60000);

      if (verify < 1) {
        throw new HttpException(
          {
            message: 'Duplicate Transaction',
            status: false,
            status_code: 4000,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(
    userId: string,
    params: TrasactionParamsDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    await this.usersService.valideUser(userId);
    const transaction = await this.transactionRepository.getWalletExtract(
      userId,
      params.type,
      pageOptionsDto,
    );

    return {
      ...transaction,
      items: transaction.items.map((item) => new TransactionDto(item)),
    };
  }
}
