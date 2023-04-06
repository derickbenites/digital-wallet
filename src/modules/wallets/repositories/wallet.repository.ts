import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WalletEntity } from '../entities/wallet.entity';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { paginateRaw } from 'nestjs-typeorm-paginate';

@Injectable()
export class WalletsRepository extends Repository<WalletEntity> {
  constructor(private dataSource: DataSource) {
    super(WalletEntity, dataSource.createEntityManager());
  }

  async findAllWallets(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(WalletEntity, 'wallets')
      .select();
    return await paginateRaw(queryBuilder, pageOptionsDto);
  }

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

  async updateWallet(wallet: WalletEntity, entityManager: EntityManager) {
    return await entityManager.update(WalletEntity, { id: wallet.id }, wallet);
  }
}
