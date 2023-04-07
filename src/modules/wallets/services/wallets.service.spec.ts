import { WalletsService } from './wallets.service';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { WalletDto } from '../dto/res/wallet.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { CreateTransactionDto } from 'src/modules/transactions/dto/req/create-transaction.dto';
import { EntityManager } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { WalletsRepository } from '../repositories/wallet.repository';
import { mock } from 'jest-mock-extended';
import { WalletEntity } from '../entities/wallet.entity';

describe('WalletsService', () => {
  let walletsService: WalletsService;
  let walletsRepository: WalletsRepository;
  let pageOptionsDto: PageOptionsDto;
  let createWalletDto: CreateWalletDto;
  let wallet: WalletEntity;
  let createTransactionDto: CreateTransactionDto;
  let entityManager: any;

  beforeEach(async () => {
    pageOptionsDto = {
      page: 1,
      limit: 10,
      skip: 10,
    };

    createWalletDto = {
      userId: 'user1',
      balance: 100,
    };

    wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    createTransactionDto = {
      userId: 'user1',
      walletId: 'wallet1',
      action: 1,
      valueTransaction: 100,
    };
    entityManager = mock<EntityManager>({
      transaction: jest.fn((fn: any) => fn(mock<EntityManager>({}))),
    });
    walletsRepository = mock<WalletsRepository>({
      createWallet: jest.fn().mockResolvedValue(wallet),
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      updateWallet: jest.fn().mockResolvedValue(wallet),
      manager: mock<EntityManager>({
        transaction: jest.fn((fn: any) => fn(mock<EntityManager>({}))),
      }),
    });
    walletsService = new WalletsService(walletsRepository);
  });

  it('should be defined', () => {
    expect(walletsService).toBeDefined();
  });

  test('create wallet', async () => {
    const result = await walletsService.create(createWalletDto);

    expect(walletsRepository.createWallet).toHaveBeenCalledWith(
      createWalletDto,
    );
    expect(result).toEqual(new WalletDto(wallet));
  });

  test('find all wallets', async () => {
    const wallets = {
      items: [
        {
          id: 'wallet1',
          userId: 'user1',
          balance: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'wallet2',
          userId: 'user1',
          balance: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
    };

    walletsRepository.findAllWallets = jest.fn().mockResolvedValue({
      ...wallets,
      items: wallets.items.map((item) => new WalletDto(item)),
    });

    const result = await walletsService.findAll(pageOptionsDto);

    expect(walletsRepository.findAllWallets).toHaveBeenCalledWith(
      pageOptionsDto,
    );
    expect(result).toEqual({
      ...wallets,
      items: wallets.items.map((item) => new WalletDto(item)),
    });
  });

  test('find one wallet', async () => {
    const id = 'wallet1';
    const userId = 'user1';

    const result = await walletsService.findOne(id, userId);

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        userId,
        id,
      },
    });
    expect(result).toEqual(wallet);
  });

  test('get balance', async () => {
    const userId = 'user1';

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
    };

    const walletsService = new WalletsService(walletsRepository as any);

    const result = await walletsService.getBalance(userId);

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(result).toEqual(new WalletDto(wallet));
  });

  test('update balance - deposit', async () => {
    walletsRepository.updateWallet = jest.fn().mockResolvedValue(wallet);

    const result = await walletsService.updateBalance(
      createTransactionDto,
      entityManager,
    );

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        userId: createTransactionDto.userId,
        id: createTransactionDto.walletId,
      },
    });
    expect(wallet.balance).toEqual(200);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - payment', async () => {
    const result = await walletsService.updateBalance(
      createTransactionDto,
      entityManager,
    );

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        userId: createTransactionDto.userId,
        id: createTransactionDto.walletId,
      },
    });
    expect(wallet.balance).toEqual(200);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - withdrawal', async () => {
    const result = await walletsService.updateBalance(
      createTransactionDto,
      entityManager,
    );

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        userId: createTransactionDto.userId,
        id: createTransactionDto.walletId,
      },
    });
    expect(wallet.balance).toEqual(200);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - reversal', async () => {
    const result = await walletsService.updateBalance(
      createTransactionDto,
      entityManager,
    );

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        userId: createTransactionDto.userId,
        id: createTransactionDto.walletId,
      },
    });
    expect(wallet.balance).toEqual(200);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - insufficient balance', async () => {
    walletsService.updateBalance = jest
      .fn()
      .mockRejectedValue(
        new Error('Insufficient balance to carry out transaction'),
      );

    await expect(
      walletsService.updateBalance(createTransactionDto, entityManager),
    ).rejects.toThrowError(
      new HttpException(
        {
          message: 'Insufficient balance to carry out transaction',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: {
        userId: createTransactionDto.userId,
        id: createTransactionDto.walletId,
      },
    });
    expect(wallet.balance).toEqual(2000);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).not.toHaveBeenCalled();
  });

  test('validate wallet', async () => {
    const walletId = 'wallet1';

    await walletsService.valideWallet(walletId);

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: walletId },
    });
  });

  test('validate wallet - not found', async () => {
    const walletId = 'wallet1';

    walletsRepository.findOneOrFail = jest
      .fn()
      .mockRejectedValue(new Error('Wallet does not found'));

    await expect(walletsService.valideWallet(walletId)).rejects.toThrowError(
      new HttpException(
        {
          message: 'Wallet does not found',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: walletId },
    });
  });
});
