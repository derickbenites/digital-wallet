import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { UpdateWalletDto } from '../dto/req/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsRepository } from '../repositories/wallet.repository';
import { WalletDto } from '../dto/res/wallet.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletsRepository)
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const wallet = await this.walletsRepository.createWallet(createWalletDto);
    return new WalletDto(wallet);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const wallets = await this.walletsRepository.findAllWallets(pageOptionsDto);

    return {
      ...wallets,
      items: wallets.items.map((item) => new WalletDto(item)),
    };
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
