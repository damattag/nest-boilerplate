import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { IHashService } from './interface';

@Module({
  providers: [
    {
      provide: IHashService,
      useClass: HashService,
    },
  ],
  exports: [IHashService],
})
export class HashModule {}
