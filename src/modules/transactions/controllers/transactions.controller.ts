import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/req/create-transaction.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionDto } from '../dto/res/transaction.dto';
import { TrasactionParamsDto } from '../dto/req/transaction-params.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

@Controller('transactions')
@ApiTags('Transactions')
@ApiResponse({ status: 200 })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ operationId: 'createTransaction' })
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: TransactionDto })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @ApiOperation({ operationId: 'getWalletExtract' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: TransactionDto })
  @Get(':userId')
  findAll(
    @Param('userId') userId: string,
    @Query() params: TrasactionParamsDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.transactionsService.findAll(userId, params, pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }
}
