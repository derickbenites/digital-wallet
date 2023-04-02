import { Module } from '@nestjs/common';
import { WalletsService } from './services/wallets.service';
import { WalletsController } from './controllers/wallets.controller';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
