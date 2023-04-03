import { Module } from '@nestjs/common';
import { PaymentReversalService } from './services/payment-reversal.service';
import { PaymentReversalController } from './controllers/payment-reversal.controller';
import { PaymentReversalRepository } from './repositories/payment-reversal.repository';

@Module({
  controllers: [PaymentReversalController],
  providers: [PaymentReversalService, PaymentReversalRepository],
})
export class PaymentReversalModule {}
