import { WalletsService } from 'src/modules/wallets/services/wallets.service';
import { ShoppingService } from './shopping.service';
import mock from 'jest-mock-extended/lib/Mock';
import { TransactionsService } from 'src/modules/transactions/services/transactions.service';
import { ShoppingRepository } from '../repositories/shopping.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ShoppingEntity } from '../entities/shopping.entity';
import { EntityManager } from 'typeorm';

describe('ShoppingService', () => {
  let shoppingService: ShoppingService;
  let walletService: WalletsService;
  let transactionService: TransactionsService;
  let shoppingRepository: ShoppingRepository;

  const shoppingEntity: ShoppingEntity = {
    id: 'any_id',
    userId: '1',
    walletId: '1',
    price: 50,
  } as ShoppingEntity;

  beforeEach(async () => {
    transactionService = mock<TransactionsService>({
      create: jest.fn(),
      valideTransaction: jest.fn(),
      saveTransaction: jest.fn(),
      findAll: jest.fn(),
    });
    walletService = mock<WalletsService>({
      updateBalance: jest.fn(),
      findOne: jest.fn().mockResolvedValue({ balance: 100 }),
    });
    shoppingRepository = mock<ShoppingRepository>({
      manager: mock<EntityManager>({
        transaction: jest.fn((fn: any) => fn(mock<EntityManager>({}))),
      }),
      createShopping: jest.fn().mockResolvedValue(shoppingEntity),
    });

    shoppingService = new ShoppingService(
      shoppingRepository,
      walletService,
      transactionService,
    );
  });

  it('should be defined', () => {
    expect(shoppingService).toBeDefined();
  });

  test('create shopping with valid data', async () => {
    const createShoppingDto = {
      userId: '1',
      walletId: '1',
      price: 50,
    };

    // shoppingRepository.createShopping = jest
    //   .fn()
    //   .mockResolvedValueOnce({ id: '1', ...createShoppingDto });

    const result = await shoppingService.create(createShoppingDto);

    
    expect(shoppingRepository.manager.transaction).toHaveBeenCalled();
    // expect(shoppingRepository.createShopping).toHaveBeenCalledWith(
    //   createShoppingDto,
    //   undefined,
    // );
    // expect(walletService.findOne).toHaveBeenCalledWith(
    //   createShoppingDto.walletId,
    //   createShoppingDto.userId,
    // );
    // expect(walletService.updateBalance).toHaveBeenCalledWith(
    //   {
    //     userId: createShoppingDto.userId,
    //     walletId: createShoppingDto.walletId,
    //     valueTransaction: createShoppingDto.price,
    //     action: 3,
    //   },
    //   expect.any(Object),
    // );
    // expect(transactionService.saveTransaction).toHaveBeenCalledWith(
    //   {
    //     userId: createShoppingDto.userId,
    //     walletId: createShoppingDto.walletId,
    //     valueTransaction: createShoppingDto.price,
    //     action: 3,
    //   },
    //   expect.any(Object),
    // );
    expect(result).toEqual({ id: '1', ...createShoppingDto });
  });

  test('create shopping with invalid data', async () => {
    const createShoppingDto = {
      userId: '1',
      walletId: '1',
      price: 150,
    };

    await expect(shoppingService.create(createShoppingDto)).rejects.toThrow(
      new HttpException(
        {
          message: 'Insufficient balance to carry out transaction',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  test('find all shopping', async () => {
    const pageOptionsDto = {
      page: 1,
      limit: 10,
      skip: 10,
    };

    shoppingRepository.findAllShopping = jest.fn().mockResolvedValueOnce({
      items: [{ id: '1', userId: '1', walletId: '1', price: 50 }],
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
    });

    const result = await shoppingService.findAll(pageOptionsDto);

    expect(result).toEqual({
      items: [{ id: '1', userId: '1', walletId: '1', price: 50 }],
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
    });
    expect(shoppingRepository.findAllShopping).toHaveBeenCalledWith(
      pageOptionsDto,
    );
  });

  test('remove shopping with valid data', async () => {
    const id = '1';

    const shoppingRepository = {
      manager: {
        transaction: jest.fn().mockImplementation((callback) => callback()),
      },
      findOneOrFail: jest
        .fn()
        .mockReturnValue({ id, userId: '1', walletId: '1', price: 50 }),
      softDelete: jest.fn(),
    };

    const transactionService = {
      saveTransaction: jest.fn(),
    };

    await shoppingService.remove(id);

    expect(shoppingRepository.manager.transaction).toHaveBeenCalled();
    expect(shoppingRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id },
    });
    expect(shoppingRepository.softDelete).toHaveBeenCalledWith(id);
    expect(transactionService.saveTransaction).toHaveBeenCalledWith(
      {
        userId: '1',
        walletId: '1',
        valueTransaction: 50,
        action: 3,
      },
      expect.any(Object),
    );
  });

  test('remove shopping with invalid data', async () => {
    const id = '1';

    shoppingRepository.findOneOrFail = jest
      .fn()
      .mockRejectedValue(new Error('Shopping not found'));

    shoppingRepository.softDelete = jest.fn();

    await expect(shoppingService.remove(id)).rejects.toThrow(
      new HttpException(
        {
          message: 'Shopping not found',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
