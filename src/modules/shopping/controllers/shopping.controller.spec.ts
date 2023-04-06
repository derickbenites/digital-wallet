import { ShoppingController } from './shopping.controller';
import { ShoppingService } from '../services/shopping.service';
import { mock } from 'jest-mock-extended';

describe('ShoppingController', () => {
  let controller: ShoppingController;
  let shoppingService: ShoppingService;

  beforeEach(async () => {
    shoppingService = mock<ShoppingService>({
      create: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    });
    controller = new ShoppingController(shoppingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('createShopping should call shoppingService.create with the provided CreateShoppingDto', () => {
    const createShoppingDto = {
      userId: 'user_id',
      walletId: 'wallet_id',
      price: 1,
    };

    controller.create(createShoppingDto);

    expect(shoppingService.create).toHaveBeenCalledWith(createShoppingDto);
  });

  test('findAll should call shoppingService.findAll with params, and pageOptionsDto', () => {
    const pageOptionsDto = { page: 1, limit: 10, skip: 10 };
    controller.findAll(pageOptionsDto);

    expect(shoppingService.findAll).toHaveBeenCalledWith(pageOptionsDto);
  });

  test('remove should call shoppingService.remove with id', () => {
    const id = 'any_id';
    controller.remove(id);

    expect(shoppingService.remove).toHaveBeenCalledWith(id);
  });
});
