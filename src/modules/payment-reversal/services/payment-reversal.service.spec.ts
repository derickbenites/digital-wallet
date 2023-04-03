import { Test, TestingModule } from '@nestjs/testing';
import { PaymentReversalService } from './payment-reversal.service';

describe('PaymentReversalService', () => {
  let service: PaymentReversalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentReversalService],
    }).compile();

    service = module.get<PaymentReversalService>(PaymentReversalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
