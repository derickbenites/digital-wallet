import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingRepository } from '../repositories/shopping.repository';
import { ShoppingDto } from '../dto/res/shopping.dto';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { WalletsService } from '../../../modules/wallets/services/wallets.service';
import { TypeTransaction } from '../../../common/constants/type-transaction.constant';
import { TransactionsService } from '../../../modules/transactions/services/transactions.service';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingRepository)
    private readonly shoppingRepository: ShoppingRepository,
    private readonly walletService: WalletsService,
    private readonly transactionService: TransactionsService,
  ) {}

  async create(createShoppingDto: CreateShoppingDto) {
    const { userId, walletId, price } = createShoppingDto;

    try {
      const wallet = await this.walletService.findOne(walletId, userId);

      this.validateShopping(wallet.balance, price);

      const result = await this.shoppingRepository.manager.transaction(
        async (entityManager) => {
          const shopping = await this.shoppingRepository.createShopping(
            createShoppingDto,
            entityManager,
          );

          const transaction = {
            userId,
            walletId,
            valueTransaction: price,
            action: TypeTransaction.PAYMENT,
          };

          await this.walletService.updateBalance(transaction, entityManager);
          await this.transactionService.saveTransaction(
            transaction,
            entityManager,
          );
          return new ShoppingDto(shopping);
        },
      );
      return result;
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

  async remove(id: string) {
    try {
      await this.shoppingRepository.manager.transaction(
        async (entityManager) => {
          const shopping = await this.shoppingRepository.findOneOrFail({
            where: { id },
          });
          const { userId, walletId, price } = shopping;

          await this.shoppingRepository.softDelete(id);

          this.transactionService.saveTransaction(
            {
              userId,
              walletId,
              valueTransaction: price,
              action: TypeTransaction.REVERSAL,
            },
            entityManager,
          );
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

  async validateShopping(balance: number, price: number) {
    if (balance < price) {
      throw new HttpException(
        {
          message: 'Insufficient balance to carry out transaction',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
