import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { WalletsService } from '../services/wallets.service';
import { CreateWalletDto } from '../dto/req/create-wallet.dto';
import { UpdateWalletDto } from '../dto/req/update-wallet.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WalletDto } from '../dto/res/wallet.dto';
import { WalletPaginateDto } from '../dto/res/wallet-paginate.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

@Controller('wallets')
@ApiTags('Wallets')
@ApiResponse({ status: 200 })
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @ApiOperation({ operationId: 'createWallet' })
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: WalletDto })
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @ApiOperation({ operationId: 'allWallets' })
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: WalletPaginateDto })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.walletsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(+id);
  }
}
