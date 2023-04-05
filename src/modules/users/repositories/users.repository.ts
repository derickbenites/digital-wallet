import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/req/create-user.dto';
import * as bcrypt from 'bcrypt';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findAllUsers(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(UserEntity, 'users')
      .select();
    return await paginateRaw(queryBuilder, pageOptionsDto);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, name, password } = createUserDto;

    const user = this.manager.create(UserEntity, {
      email: email,
      name: name,
      status: true,
      password: await this.hashPassword(password),
    });

    try {
      return await this.manager.save(UserEntity, user);
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Email is already in use');
      } else {
        throw new InternalServerErrorException('Error saving user to database');
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async updateUser(body: UpdateUserDto, id: string) {
    const userUpdated = await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        email: body.email,
        name: body.name,
        status: body.status,
        password: await this.hashPassword(body.password),
      })
      .where('id = :id', { id: id })
      .execute()
      .then(async (data) => {
        return await this.dataSource.manager.findOneBy(UserEntity, { id: id });
      });
    return userUpdated;
  }

  async removeUser(id: string) {
    const user = await this.dataSource.manager.findOneBy(UserEntity, {
      id: id,
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
    await this.dataSource.manager
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        updatedBy: user.id,
        deletedAt: new Date(),
        deletedBy: user.id,
        status: false,
      })
      .where('id = :id', { id: id })
      .execute()
      .then((data) => {
        return {
          message: 'User deleted succefuly',
          status: true,
          status_code: 2000,
        };
      });
  }
}
