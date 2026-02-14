import { ConfigModule, ConfigService } from '@nestjs/config';
import type {
  ThrottlerModuleOptions,
  ThrottlerAsyncOptions,
} from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import type TNodeEnv from 'src/common/types/node.env.types';

export const throttlerAsyncOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<ThrottlerModuleOptions> => {
    const nodeEnv = configService.getOrThrow<TNodeEnv>('NODE_ENV');

    // Multi-tier rate limiting for better UX while preventing abuse
    const baseOptions: ThrottlerModuleOptions = {
      throttlers: [
        {
          // Short-term: Prevent rapid-fire submissions (1 request per 60 seconds)
          name: 'short',
          ttl: 60000, // 1 minute
          limit: 1,
        },
        {
          // Medium-term: Limit requests within a session (3 requests per hour)
          name: 'medium',
          ttl: 3600000, // 1 hour
          limit: 3,
        },
        {
          // Long-term: Daily limit to prevent sustained abuse (5 requests per day)
          name: 'long',
          ttl: 86400000, // 24 hours
          limit: 5,
        },
      ],
    };

    // Use Redis storage in production/staging for persistence across restarts
    if (nodeEnv === 'production' || nodeEnv === 'stagging') {
      return {
        ...baseOptions,
        storage: new ThrottlerStorageRedisService({
          host: configService.getOrThrow<string>('CORE_REDIS_HOST'),
          port: configService.getOrThrow<number>('CORE_REDIS_PORT'),
          password: configService.getOrThrow<string>('CORE_REDIS_PASSWORD'),
        }),
      };
    }

    // Use in-memory storage for development
    return baseOptions;
  },
  inject: [ConfigService],
};
