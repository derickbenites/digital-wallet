import { Injectable } from '@nestjs/common';
import { CreatePaymentReversalDto } from '../dto/req/create-payment-reversal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentReversalRepository } from '../repositories/payment-reversal.repository';
import { PaymentReversalDto } from '../dto/res/payment-reversal.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

@Injectable()
export class PaymentReversalService {
  constructor(
    @InjectRepository(PaymentReversalRepository)
    private readonly paymentReversalRepository: PaymentReversalRepository,
  ) {}

  async create(createPaymentReversalDto: CreatePaymentReversalDto) {
    //needs implement roles about register payment reversal
    const paymentReversal =
      await this.paymentReversalRepository.createPaymentReversal(
        createPaymentReversalDto,
      );
    return new PaymentReversalDto(paymentReversal);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    //needs implement roles about register shopping walletId/userId
    const shopping =
      await this.paymentReversalRepository.findAllPaymentReversal(
        pageOptionsDto,
      );

    return {
      ...shopping,
      items: shopping.items.map((item) => new PaymentReversalDto(item)),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentReversal`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentReversal`;
  }
}
