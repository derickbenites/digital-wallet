import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { WalletDto } from '../dto/res/wallet.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { CreateTransactionDto } from 'src/modules/transactions/dto/req/create-transaction.dto';
import { EntityManager } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('WalletsService', () => {
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsService],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('create wallet', async () => {
    const createWalletDto = new CreateWalletDto();
    createWalletDto.userId = 'user1';
    createWalletDto.balance = 100;

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      createWallet: jest.fn().mockResolvedValue(wallet),
    };

    const walletsService = new WalletsService(walletsRepository as any);

    const result = await walletsService.create(createWalletDto);

    expect(walletsRepository.createWallet).toHaveBeenCalledWith(
      createWalletDto,
    );
    expect(result).toEqual(new WalletDto(wallet));
  });

  test('find all wallets', async () => {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = 1;
    pageOptionsDto.limit = 10;

    const wallets = {
      items: [
        {
          id: 'wallet1',
          userId: 'user1',
          balance: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'wallet2',
          userId: 'user1',
          balance: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
    };

    const walletsRepository = {
      findAllWallets: jest.fn().mockResolvedValue(wallets),
    };

    const walletsService = new WalletsService(walletsRepository as any);

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
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.userId = 'user1';
    createTransactionDto.walletId = 'wallet1';
    createTransactionDto.action = 1;
    createTransactionDto.valueTransaction = 100;

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      updateWallet: jest.fn().mockResolvedValue(wallet),
    };

    const entityManager = {} as EntityManager;

    const walletsService = new WalletsService(walletsRepository as any);

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
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.userId = 'user1';
    createTransactionDto.walletId = 'wallet1';
    createTransactionDto.action = 3;
    createTransactionDto.valueTransaction = 50;

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      updateWallet: jest.fn().mockResolvedValue(wallet),
    };

    const entityManager = {} as EntityManager;

    const walletsService = new WalletsService(walletsRepository as any);

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
    expect(wallet.balance).toEqual(50);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - withdrawal', async () => {
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.userId = 'user1';
    createTransactionDto.walletId = 'wallet1';
    createTransactionDto.action = 2;
    createTransactionDto.valueTransaction = 50;

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      updateWallet: jest.fn().mockResolvedValue(wallet),
    };

    const entityManager = {} as EntityManager;

    const walletsService = new WalletsService(walletsRepository as any);

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
    expect(wallet.balance).toEqual(50);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - reversal', async () => {
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.userId = 'user1';
    createTransactionDto.walletId = 'wallet1';
    createTransactionDto.action = 4;
    createTransactionDto.valueTransaction = 50;

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      updateWallet: jest.fn().mockResolvedValue(wallet),
    };

    const entityManager = {} as EntityManager;

    const walletsService = new WalletsService(walletsRepository as any);

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
    expect(wallet.balance).toEqual(150);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).toHaveBeenCalledWith(
      wallet,
      entityManager,
    );
    expect(result).toEqual(wallet);
  });

  test('update balance - insufficient balance', async () => {
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.userId = 'user1';
    createTransactionDto.walletId = 'wallet1';
    createTransactionDto.action = 1;
    createTransactionDto.valueTransaction = 150;

    const wallet = {
      id: 'wallet1',
      userId: 'user1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const walletsRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(wallet),
      updateWallet: jest.fn().mockResolvedValue(wallet),
    };

    const entityManager = {} as EntityManager;

    const walletsService = new WalletsService(walletsRepository as any);

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
    expect(wallet.balance).toEqual(100);
    expect(wallet.updatedAt).toBeDefined();
    expect(walletsRepository.updateWallet).not.toHaveBeenCalled();
  });

  test('validate wallet', async () => {
    const walletId = 'wallet1';

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

    await walletsService.valideWallet(walletId);

    expect(walletsRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: walletId },
    });
  });

  test('validate wallet - not found', async () => {
    const walletId = 'wallet1';

    const walletsRepository = {
      findOneOrFail: jest.fn().mockRejectedValue(new Error()),
    };

    const walletsService = new WalletsService(walletsRepository as any);

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
