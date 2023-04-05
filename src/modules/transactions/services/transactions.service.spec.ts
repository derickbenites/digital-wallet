import { WalletsService } from 'src/modules/wallets/services/wallets.service';
import { TransactionsService } from './transactions.service';
import { mock } from 'jest-mock-extended';
import { UsersService } from 'src/modules/users/services/users.service';
import { TransactionRepository } from '../repositories/transaction.repository';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let walletService: WalletsService;
  let userService: UsersService;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    service = mock<TransactionsService>({
      create: jest.fn(),
      valideTransaction: jest.fn(),
      saveTransaction: jest.fn(),
      findAll: jest.fn(),
    });
    walletService = mock<WalletsService>({
      updateBalance: jest.fn(),
    });
    userService = mock<UsersService>({});
    transactionRepository = mock<TransactionRepository>({
      createTransaction: jest.fn(),
      findAllTransaction: jest.fn(),
      getWalletExtract: jest.fn(),
    });

    service = new TransactionsService(
      transactionRepository,
      userService,
      walletService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('create method should call valideTransaction, updateBalance and saveTransaction methods', async () => {
    const createTransactionDto = [
      {
        userId: 'user1',
        walletId: 'wallet1',
        valueTransaction: 100,
        action: 1,
      },
      {
        userId: 'user2',
        walletId: 'wallet2',
        valueTransaction: 50,
        action: 2,
      },
    ];
    const entityManager = {
      transaction: jest.fn().mockImplementation((callback) => callback()),
    };
    await service.create(createTransactionDto);

    expect(service.valideTransaction).toHaveBeenCalledTimes(2);
    expect(walletService.updateBalance).toHaveBeenCalledTimes(2);
    expect(service.saveTransaction).toHaveBeenCalledTimes(2);
    expect(entityManager.transaction).toHaveBeenCalledTimes(1);
  });

  test('saveTransaction method should return a transaction', async () => {
    const transactionDto = {
      userId: 'user1',
      walletId: 'wallet1',
      valueTransaction: 100,
      action: 1,
    };
    const entityManager = {
      transaction: jest.fn().mockImplementation((callback) => callback()),
    };

    const entity = mock<TransactionRepository>({});

    service.saveTransaction = await jest.fn().mockResolvedValueOnce({
      userId: 'user1',
      walletId: 'wallet1',
      valueTransaction: 100,
      action: 1,
    });

    const result = await service.saveTransaction(
      transactionDto,
      entity.manager,
    );

    expect(result).toEqual(transactionDto);
    expect(transactionRepository).toHaveBeenCalledWith(
      transactionDto,
      entityManager,
    );
  });

  test('valideTransaction method should call valideUser and valideWallet methods', async () => {
    const transactionDto = {
      userId: 'user1',
      walletId: 'wallet1',
      valueTransaction: 100,
      action: 1,
    };
    const valideUserSpy = jest.spyOn(userService, 'valideUser');
    const valideWalletSpy = jest.spyOn(walletService, 'valideWallet');

    await service.valideTransaction(transactionDto);

    expect(valideUserSpy).toHaveBeenCalledWith(transactionDto.userId);
    expect(valideWalletSpy).toHaveBeenCalledWith(transactionDto.walletId);
  });

  test('findAll method should call valideUser and getWalletExtract methods', async () => {
    const userId = 'user1';
    const params = { type: 1 };
    const pageOptionsDto = { page: 1, limit: 10, skip: 10 };
    const valideUserSpy = jest.spyOn(userService, 'valideUser');
    const getWalletExtractSpy = jest.spyOn(
      transactionRepository,
      'getWalletExtract',
    );

    await service.findAll(userId, params, pageOptionsDto);

    expect(valideUserSpy).toHaveBeenCalledWith(userId);
    expect(getWalletExtractSpy).toHaveBeenCalledWith(
      userId,
      params.type,
      pageOptionsDto,
    );
  });
});
