import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from './users.service';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { UserDto } from '../dto/res/user.dto';
import mock from 'jest-mock-extended/lib/Mock';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let createUserDto: CreateUserDto;
  let userDto: UserDto;

  beforeEach(async () => {
    // repository = mock<UsersRepository>({
    //   createUser: jest.fn(),
    //   findAllUsers: jest.fn(),
    //   updateUser: jest.fn(),
    //   removeUser: jest.fn(),
    //   findOne: jest.fn(),
    // });

    // service = new UsersService(repository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);

    createUserDto = {
      name: 'user_name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirmation: 'differentPassword',
    };
  });

  describe('create', () => {
    it('should throw an error if password confirmation does not match', async () => {
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException(
          'Password confirmation does not match',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if user cannot be created', async () => {
      repository.createUser = jest.fn().mockResolvedValueOnce(null);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException(
          {
            message: 'Unable to register user',
            status: false,
            status_code: 4000,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should return a UserDto if user is created successfully', async () => {
      const user = {
        id: '1',
        name: 'user_name',
        email: 'test@test.com',
        password: 'password',
        passwordConfirmation: 'password',
      };

      repository.createUser = jest.fn().mockResolvedValueOnce(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expect.any(UserDto));
    });
  });

  describe('findAll', () => {
    it('should return a list of UserDto', async () => {
      const pageOptionsDto: PageOptionsDto = {
        page: 1,
        limit: 10,
        skip: 10,
      };

      const users = {
        items: [
          {
            id: '1',
            email: 'test1@test.com',
            password: 'password1',
          },
          {
            id: '2',
            email: 'test2@test.com',
            password: 'password2',
          },
        ],
        totalItems: 2,
        currentPage: 1,
        totalPages: 1,
      };

      repository.findAllUsers = jest.fn().mockResolvedValueOnce(users);

      const result = await service.findAll(pageOptionsDto);

      expect(result).toEqual({
        items: expect.arrayContaining([expect.any(UserDto), expect.any(UserDto)]),
        totalItems: 2,
        currentPage: 1,
        totalPages: 1,
      });
    });
  });

  describe('update', () => {
    it('should return a UserDto if user is updated successfully', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        id: 'any_id',
        name: 'any_name',
        email: 'test@test.com',
        password: 'password',
        passwordConfirmation: 'confirmation',
        status: true,
      };

      const userUpdated = {
        id: '1',
        name: 'any_name',
        email: 'test@test.com',
        password: 'password',
        status: true,
      };

      repository.updateUser = jest.fn().mockResolvedValueOnce(userUpdated);

      const result = await service.update(id, updateUserDto);

      expect(result).toEqual(expect.any(userDto));
    });
  });

  describe('remove', () => {
    it('should call removeUser method from repository', async () => {
      const id = '1';

      await service.remove(id);

      expect(repository.removeUser).toHaveBeenCalledWith(id);
    });
  });

  describe('valideUser', () => {
    it('should throw an error if user does not exist', async () => {
      const userId = '1';

      repository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.valideUser(userId)).rejects.toThrow(
        new HttpException(
          {
            message: 'User does not found',
            status: false,
            status_code: 4000,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should not throw an error if user exists', async () => {
      const userId = '1';

      const user = {
        id: '1',
        name: 'any_name',
        email: 'test@test.com',
        password: 'password',
      };

      repository.findOne =jest.fn().mockResolvedValueOnce(user);

      await expect(service.valideUser(userId)).resolves.not.toThrow();
    });
  });
});