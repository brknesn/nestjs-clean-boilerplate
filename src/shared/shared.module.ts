import { Module } from '@nestjs/common';
import { NestCacheModule } from './infrastructure/cache/cache.module';
import { NestPinoModule } from './infrastructure/logging';

@Module({
    imports: [
        NestCacheModule,
        NestPinoModule
    ],
    providers: [
    ],
    exports: [
    ],
})
export class SharedModule { }