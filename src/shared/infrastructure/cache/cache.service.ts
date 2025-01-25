import type { Cache } from "cache-manager"
import type { Observable } from "rxjs"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { concatMap, from, map, toArray } from "rxjs"

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    deleteMatch(regexString: string): Observable<boolean> {
        return from((this.cacheManager as any).store.keys()).pipe(
            concatMap((keys: string[]) => {
                const regex = new RegExp(regexString, "i")
                const match = keys.filter((key: string) => regex.test(key))

                return from(match)
            }),
            concatMap((key: string) => {
                return from(this.cacheManager.del(key))
            }),
            toArray(),
            map(() => true),
        )
    }

    async resetCache(): Promise<void> {
        const keys = await (this.cacheManager as any).store.keys()
        await Promise.all(keys.map(key => this.cacheManager.del(key)))
    }
}