import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module';
import { ClearCacheMiddleware } from './common/middlewares/cache.middleware';
import { DomainModule } from './modules/domain.module';

const stripeWebhookPath = "stripe/webhook"
const excludedPaths = [stripeWebhookPath]
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local', '.env.development', '.env.production'],
    }),
    SharedModule,
    DomainModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClearCacheMiddleware)
      .exclude(
        ...excludedPaths.map(path => ({
          path,
          method: RequestMethod.ALL,
        })),
      )
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      })
  }
}
