import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { PaymentReversalEntity } from '../entities/payment-reversal.entity';
import { CreatePaymentReversalDto } from '../dto/req/create-payment-reversal.dto';

@Injectable()
export class PaymentReversalRepository extends Repository<PaymentReversalEntity> {
  constructor(private dataSource: DataSource) {
    super(PaymentReversalEntity, dataSource.createEntityManager());
  }

  async findAllPaymentReversal(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(PaymentReversalEntity, 'paymentReversal')
      .select();
    return await paginateRaw(queryBuilder, pageOptionsDto);
  }

  async createPaymentReversal(
    createPaymentReversalDto: CreatePaymentReversalDto,
  ): Promise<PaymentReversalEntity> {
    const shopping = this.manager.create(
      PaymentReversalEntity,
      createPaymentReversalDto,
    );

    try {
      return await this.manager.save(PaymentReversalEntity, shopping);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving payment reversal to database',
      );
    }
  }
}
