import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { PaymentReversalService } from '../services/payment-reversal.service';
import { CreatePaymentReversalDto } from '../dto/req/create-payment-reversal.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentReversalDto } from '../dto/res/payment-reversal.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

@Controller('payment-reversal')
@ApiTags('PaymentReversal')
@ApiResponse({ status: 200 })
export class PaymentReversalController {
  constructor(
    private readonly paymentReversalService: PaymentReversalService,
  ) {}

  @ApiOperation({ operationId: 'createPaymentReversal' })
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaymentReversalDto })
  create(@Body() createPaymentReversalDto: CreatePaymentReversalDto) {
    return this.paymentReversalService.create(createPaymentReversalDto);
  }

  @ApiOperation({ operationId: 'allPaymentReversal' })
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaymentReversalDto })
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.paymentReversalService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentReversalService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentReversalService.remove(+id);
  }
}
