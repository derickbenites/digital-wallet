import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { mock } from 'jest-mock-extended';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    userService = mock<UsersService>({
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });

    controller = new UsersController(userService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('createUser should call userService.create with the provided CreateUserDto', () => {
    const createUserDto = {
      name: 'name',
      email: 'email',
      password: 'password',
      passwordConfirmation: 'password-confirmation',
    };
    controller.create(createUserDto);

    expect(userService.create).toHaveBeenCalledWith(createUserDto);
  });

  test('findAll should call userService.findAll with the provided userId, params, and pageOptionsDto', () => {
    const pageOptionsDto = { page: 1, limit: 10, skip: 10 };
    controller.findAll(pageOptionsDto);

    expect(userService.findAll).toHaveBeenCalledWith(pageOptionsDto);
  });

  test('updateUser should call userService.update with the provided UpdateUserDto', () => {
    const updateUserDto = {
      id: 'any_id',
      name: 'name',
      email: 'email',
      password: 'password',
      passwordConfirmation: 'password-confirmation',
      status: true,
    };
    controller.update('user_id', updateUserDto);

    expect(userService.update).toHaveBeenCalledWith('user_id', updateUserDto);
  });

  test('remove should call userService.remove with the provided id', () => {
    controller.remove('user_id');
    expect(userService.remove).toHaveBeenCalledWith('user_id');
  });
});
