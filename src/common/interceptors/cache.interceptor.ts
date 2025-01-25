import type { ExecutionContext } from "@nestjs/common"
import { CACHE_KEY_METADATA, CacheInterceptor } from "@nestjs/cache-manager"
import { Injectable } from "@nestjs/common"
import { FastifyRequest } from 'fastify'
import { IGNORE_CACHING_META } from "../constants/metadata.constants"

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    protected isRequestCacheable(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<FastifyRequest>()

        const ignoreCaching: boolean = this.reflector.get(
            IGNORE_CACHING_META,
            context.getHandler(),
        )

        return !ignoreCaching && request.method === "GET"
    }
}

@Injectable()
export class CacheKeyInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const httpAdapter = this.httpAdapterHost.httpAdapter
        const isHttpApp = httpAdapter != null && httpAdapter.getRequestMethod != null
        const cacheMetadata = this.reflector.get<string>(CACHE_KEY_METADATA, context.getHandler())
        const request = context.switchToHttp().getRequest<FastifyRequest & { user?: { idx: string } }>()
        const userId = request.user?.idx ?? 'anonymous'

        if (!isHttpApp || cacheMetadata)
            return `${cacheMetadata}_${userId}`

        if (!this.isRequestCacheable(context))
            return undefined

        return `${httpAdapter.getRequestUrl(request)}_${userId}`
    }
}