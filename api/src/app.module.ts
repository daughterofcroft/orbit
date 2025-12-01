import { Module } from '@nestjs/common';
import { DecodeController } from './decode/decode.controller';
import { RiscVDecoderService } from './decode/risc-v-decoder.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [DecodeController, HealthController],
  providers: [RiscVDecoderService],
})
export class AppModule {}
