import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { mock } from 'jest-mock-extended';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    transactionsService = mock<TransactionsService>({
      create: jest.fn(),
      findAll: jest.fn(),
    });

    controller = new TransactionsController(transactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('createTransaction should call transactionsService.create with the provided createTransactionDto', () => {
    const createTransactionDto = [
      {
        userId: 'user_id',
        walletId: 'wallet_id',
        action: 1,
        valueTransaction: 5,
      },
    ];
    controller.create(createTransactionDto);

    expect(transactionsService.create).toHaveBeenCalledWith(
      createTransactionDto,
    );
  });

  test('findAll should call transactionsService.findAll with the provided userId, params, and pageOptionsDto', () => {
    const userId = '123';
    const params = { type: 1 };
    const pageOptionsDto = { page: 1, limit: 10, skip: 10 };
    controller.findAll(userId, params, pageOptionsDto);

    expect(transactionsService.findAll).toHaveBeenCalledWith(
      userId,
      params,
      pageOptionsDto,
    );
  });
});
