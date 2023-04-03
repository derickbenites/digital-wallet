import { Test, TestingModule } from '@nestjs/testing';
import { PaymentReversalService } from '../services/payment-reversal.service';
import { PaymentReversalController } from './payment-reversal.controller';

describe('PaymentReversalController', () => {
  let controller: PaymentReversalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentReversalController],
      providers: [PaymentReversalService],
    }).compile();

    controller = module.get<PaymentReversalController>(
      PaymentReversalController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
