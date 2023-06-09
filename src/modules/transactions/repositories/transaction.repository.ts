import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/req/create-transaction.dto';
import { TypeTransaction } from '../../../common/constants/type-transaction.constant';

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
  constructor(private dataSource: DataSource) {
    super(TransactionEntity, dataSource.createEntityManager());
  }

  async findAllTransaction(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(TransactionEntity, 'transactions')
      .select();
    return await paginateRaw(queryBuilder, pageOptionsDto);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    entityManager: EntityManager,
  ): Promise<TransactionEntity> {
    const transactionEntity = {
      ...createTransactionDto,
      createdBy: createTransactionDto.userId,
    };

    const transaction = entityManager.create(
      TransactionEntity,
      transactionEntity,
    );
    return await entityManager.save(TransactionEntity, transaction);
  }

  async getWalletExtract(
    userId: string,
    type: TypeTransaction,
    pageOptionsDto: PageOptionsDto,
  ) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(TransactionEntity, 'transactions')
      .select()
      .where('user_id = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('action = :type', { type });
    }
    return await paginateRaw(queryBuilder, pageOptionsDto);
  }
}
