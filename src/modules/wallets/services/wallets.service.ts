import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { UpdateWalletDto } from '../dto/req/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsRepository } from '../repositories/wallet.repository';
import { WalletDto } from '../dto/res/wallet.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletsRepository)
    private readonly usersRepository: WalletsRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const wallet = await this.usersRepository.createWallet(createWalletDto);
    return new WalletDto(wallet);
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
