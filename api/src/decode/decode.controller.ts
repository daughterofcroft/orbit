import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RiscVDecoderService } from './risc-v-decoder.service';

@Controller('api/decode')
export class DecodeController {
  constructor(private readonly decoderService: RiscVDecoderService) {}

  @Get()
  decode(@Query('hex') hex: string) {
    if (!hex) {
      throw new BadRequestException('Hex parameter is required');
    }

    try {
      return this.decoderService.decode(hex);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
