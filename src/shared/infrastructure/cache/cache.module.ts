import { CacheModule } from "@nestjs/cache-manager"
import { Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { redisStore } from "cache-manager-ioredis-yet"
import { CacheService } from "./cache.service"

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          host: configService.get<string>('appConfig.redis.host'),
          port: configService.get<number>('appConfig.redis.port'),
          password: configService.get<string>('appConfig.redis.password'),
          maxRetriesPerRequest: 5,
          retryStrategy: (times) => Math.min(times * 50, 2000),
        }),
      }),
      isGlobal: true,
    }),
  ],
  exports: [CacheModule, CacheService],
  providers: [CacheService],
})
export class NestCacheModule { }