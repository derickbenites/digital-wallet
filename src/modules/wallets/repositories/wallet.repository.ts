import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WalletEntity } from '../entities/wallet.entity';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';

@Injectable()
export class WalletsRepository extends Repository<WalletEntity> {
  constructor(private dataSource: DataSource) {
    super(WalletEntity, dataSource.createEntityManager());
  }

  // async findAllUsers(pageOptionsDto: PageOptionsDto) {
  //   const queryBuilder = this.dataSource
  //     .createQueryBuilder()
  //     .from(UserEntity, 'users')
  //     .select();
  //   return await paginateRaw(queryBuilder, pageOptionsDto);
  // }

  async createWallet(createWalletDto: CreateWalletDto): Promise<WalletEntity> {
    if (
      await this.manager.findOneBy(WalletEntity, {
        userId: createWalletDto.userId,
      })
    ) {
      throw new InternalServerErrorException(
        'The user already has a registered wallet',
      );
    }

    const wallet = this.manager.create(WalletEntity, createWalletDto);

    try {
      return await this.manager.save(WalletEntity, wallet);
    } catch (error) {
      throw new InternalServerErrorException('Error saving wallet to database');
    }
  }

  // async removeWallet(id: string) {
  //   const user = await this.dataSource.manager.findOneBy(UserEntity, {
  //     id: id,
  //   });

  //   if (!user) {
  //     throw new HttpException(
  //       {
  //         message: 'User does not found',
  //         status: false,
  //         status_code: 4000,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   await this.dataSource.manager
  //     .createQueryBuilder()
  //     .update(UserEntity)
  //     .set({
  //       updatedBy: user.id,
  //       deletedAt: new Date(),
  //       deletedBy: user.id,
  //       status: false,
  //     })
  //     .where('id = :id', { id: id })
  //     .execute()
  //     .then((data) => {
  //       return {
  //         message: 'User deleted succefuly',
  //         status: true,
  //         status_code: 2000,
  //       };
  //     });
  // }
}
