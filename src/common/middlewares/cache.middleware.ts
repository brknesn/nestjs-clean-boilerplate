import type { NestMiddleware } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { FastifyRequest, FastifyReply } from "fastify"
import { CacheService } from "../../shared/infrastructure/cache/cache.service"

@Injectable()
export class ClearCacheMiddleware implements NestMiddleware {
    constructor(private readonly cacheService: CacheService) { }

    async use(request: FastifyRequest, _response: FastifyReply, done: (err?: Error) => void) {
        try {
            if (request.query && typeof request.query === 'object' && 'clearCache' in request.query) {
                if (request.query.clearCache === 'true') {
                    await this.cacheService.resetCache()
                }
            }
            done()
        } catch (err) {
            done(err as Error)
        }
    }
}