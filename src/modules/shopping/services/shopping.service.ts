import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingRepository } from '../repositories/shopping.repository';
import { ShoppingDto } from '../dto/res/shopping.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { WalletsService } from 'src/modules/wallets/services/wallets.service';
import { TypeTransaction } from 'src/common/constants/type-transaction.constant';
import { TransactionsService } from 'src/modules/transactions/services/transactions.service';

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

    const wallet = await this.walletService.findOne(walletId, userId);

    this.validateShopping(wallet.balance, price);

    const shopping = await this.shoppingRepository.createShopping(
      createShoppingDto,
    );

    const transaction = {
      userId,
      walletId,
      valueTransaction: price,
      action: TypeTransaction.PAYMENT,
    };

    this.walletService.updateBalance(transaction);
    this.transactionService.saveTransaction(transaction);

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
