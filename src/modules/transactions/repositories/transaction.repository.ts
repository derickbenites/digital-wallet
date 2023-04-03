import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/req/create-transaction.dto';

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
  ): Promise<TransactionEntity> {
    const transactionEntity = {
      ...createTransactionDto,
      createdBy: createTransactionDto.userId,
    };

    const transaction = this.manager.create(
      TransactionEntity,
      transactionEntity,
    );

    try {
      return await this.manager.save(TransactionEntity, transaction);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving transaction to database',
      );
    }
  }
}