import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsRepository } from '../repositories/wallet.repository';
import { WalletDto } from '../dto/res/wallet.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { CreateTransactionDto } from 'src/modules/transactions/dto/req/create-transaction.dto';
import { TypeTransaction } from 'src/common/constants/type-transaction.constant';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletsRepository)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const wallet = await this.walletsRepository.createWallet(createWalletDto);
    return new WalletDto(wallet);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const wallets = await this.walletsRepository.findAllWallets(pageOptionsDto);

    return {
      ...wallets,
      items: wallets.items.map((item) => new WalletDto(item)),
    };
  }

  async findOne(id: string, userId: string) {
    const wallet = await this.walletsRepository.findOneOrFail({
      where: {
        userId,
        id,
      },
    });
    return wallet;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  async updateBalance(createTransactionDto: CreateTransactionDto) {
    const wallet = await this.walletsRepository.findOneOrFail({
      where: {
        userId: createTransactionDto.userId,
        id: createTransactionDto.walletId,
      },
    });

    if (
      createTransactionDto.action === TypeTransaction.DEPOSIT ||
      createTransactionDto.action === TypeTransaction.REVERSAL
    ) {
      wallet.balance = wallet.balance + createTransactionDto.valueTransaction;
    }

    if (
      createTransactionDto.action === TypeTransaction.PAYMENT ||
      createTransactionDto.action === TypeTransaction.WITHDRAW
    ) {
      if (wallet.balance < createTransactionDto.valueTransaction) {
        throw new HttpException(
          {
            message: 'Insufficient balance to carry out transaction',
            status: false,
            status_code: 4000,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.balance = wallet.balance - createTransactionDto.valueTransaction;
    }
    wallet.updatedAt = new Date();
    this.walletsRepository.updateWallet(wallet);
  }

  async valideWallet(walletId: string) {
    const wallet = this.walletsRepository.findOneOrFail({
      where: { id: walletId },
    });
    if (!wallet) {
      throw new HttpException(
        {
          message: 'Wallet does not found',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
