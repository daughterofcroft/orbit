import { Module } from '@nestjs/common';
import { DecodeController } from './decode/decode.controller';
import { RiscVDecoderService } from './decode/risc-v-decoder.service';

@Module({
  imports: [],
  controllers: [DecodeController],
  providers: [RiscVDecoderService],
})
export class AppModule {}
