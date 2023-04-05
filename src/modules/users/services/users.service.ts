import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { UserDto } from '../dto/res/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new HttpException(
        'Password confirmation does not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersRepository.createUser(createUserDto);

    if (!user) {
      throw new HttpException(
        {
          message: 'Unable to register user',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return new UserDto(user);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const users = await this.usersRepository.findAllUsers(pageOptionsDto);

    return {
      ...users,
      items: users.items.map((item) => new UserDto(item)),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userUpdated = await this.usersRepository.updateUser(
      updateUserDto,
      id,
    );

    if (userUpdated) {
      return new UserDto(userUpdated);
    }
  }

  remove(id: string) {
    return this.usersRepository.removeUser(id);
  }

  async valideUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(
        {
          message: 'User does not found',
          status: false,
          status_code: 4000,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
