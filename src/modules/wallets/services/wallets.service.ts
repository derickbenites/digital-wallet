import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsRepository } from '../repositories/wallet.repository';
import { WalletDto } from '../dto/res/wallet.dto';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { CreateTransactionDto } from '../../../modules/transactions/dto/req/create-transaction.dto';
import { TypeTransaction } from '../../../common/constants/type-transaction.constant';
import { EntityManager } from 'typeorm';

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

  async getBalance(userId: string) {
    const wallet = await this.walletsRepository.findOneOrFail({
      where: { userId },
    });

    return new WalletDto(wallet);
  }

  async updateBalance(
    createTransactionDto: CreateTransactionDto,
    entityManager: EntityManager,
  ) {
    try {
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

      return await this.walletsRepository.updateWallet(wallet, entityManager);
    } catch (error) {
      console.error(
        JSON.stringify({ context: this.updateBalance.name, message: error }),
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

  async valideWallet(walletId: string) {
    const wallet = await this.walletsRepository.findOneOrFail({
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
