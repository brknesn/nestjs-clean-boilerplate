import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common"
import type { Observable } from "rxjs"
import { Injectable } from "@nestjs/common"
import { from, of } from "rxjs"
import { tap } from "rxjs/operators"
import { FastifyReply, FastifyRequest } from "fastify"
import { CacheService } from "../../shared/infrastructure/cache/cache.service"
@Injectable()
export class ClearCacheInterceptor implements NestInterceptor {
    constructor(private readonly cacheService: CacheService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse<FastifyReply>()
                const request = context.switchToHttp().getRequest<FastifyRequest>()

                if (
                    request.method !== "GET"
                    && response.statusCode >= 200
                    && response.statusCode < 300
                ) {
                    return from(this.cacheService.resetCache())
                }

                return of()
            }),
        )
    }
}