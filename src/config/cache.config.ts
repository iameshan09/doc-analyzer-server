import type { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

export const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minute default ttl
const CACHE_NAMESPACE = 'aboutlk-server-cache';

export const cacheModuleAsyncOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const nodeEnv = configService.get<string>('NODE_ENV');
    const isProduction = nodeEnv === 'production' || nodeEnv === 'staging';

    if (isProduction) {
      const redisHost = configService.getOrThrow<string>('CORE_REDIS_HOST');
      const redisPort = configService.getOrThrow<number>('CORE_REDIS_PORT');
      const redisPassword = configService.getOrThrow<string>(
        'CORE_REDIS_PASSWORD',
      );

      const keyvRedis = new KeyvRedis(
        `redis://:${redisPassword}@${redisHost}:${redisPort}`,
      );

      return {
        stores: [new Keyv({ store: keyvRedis, namespace: CACHE_NAMESPACE })],
        ttl: DEFAULT_CACHE_TTL,
      };
    }

    // In-memory cache for development (uses default Keyv in-memory store)
    return {
      stores: [new Keyv({ namespace: CACHE_NAMESPACE })],
      ttl: DEFAULT_CACHE_TTL,
    };
  },
};
