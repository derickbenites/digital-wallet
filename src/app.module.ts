import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, WalletsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
