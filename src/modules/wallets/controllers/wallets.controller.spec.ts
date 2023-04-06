import { WalletsController } from './wallets.controller';
import { WalletsService } from '../services/wallets.service';
import mock from 'jest-mock-extended/lib/Mock';

describe('WalletsController', () => {
  let controller: WalletsController;
  let service: WalletsService;

  beforeEach(async () => {
    service = mock<WalletsService>({
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    });
    controller = new WalletsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('create should call walletService.create with the provided createWalletDto', () => {
    const createWalletDto = {
      userId: 'user_id',
      balance: 12,
    };
    controller.create(createWalletDto);

    expect(service.create).toHaveBeenCalledWith(createWalletDto);
  });

  test('findAll should call walletService.findAll with params, and pageOptionsDto', () => {
    const pageOptionsDto = { page: 1, limit: 10, skip: 10 };
    controller.findAll(pageOptionsDto);

    expect(service.findAll).toHaveBeenCalledWith(pageOptionsDto);
  });

  test('findOne should call walletService.findAll with userId', () => {
    const userId = 'user_id';
    controller.findOne(userId);

    expect(service.getBalance).toHaveBeenCalledWith(userId);
  });
});
