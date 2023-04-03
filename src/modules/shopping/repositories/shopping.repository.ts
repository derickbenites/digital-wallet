import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { CreateShoppingDto } from '../dto/req/create-shopping.dto';
import { ShoppingEntity } from '../entities/shopping.entity';

@Injectable()
export class ShoppingRepository extends Repository<ShoppingEntity> {
  constructor(private dataSource: DataSource) {
    super(ShoppingEntity, dataSource.createEntityManager());
  }

  async findAllShopping(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(ShoppingEntity, 'shopping')
      .select();
    return await paginateRaw(queryBuilder, pageOptionsDto);
  }

  async createShopping(
    createShoppingDto: CreateShoppingDto,
  ): Promise<ShoppingEntity> {
    const shopping = this.manager.create(ShoppingEntity, createShoppingDto);

    try {
      return await this.manager.save(ShoppingEntity, shopping);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving shopping to database',
      );
    }
  }
}