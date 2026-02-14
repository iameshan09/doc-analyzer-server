import { BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TNodeEnv from 'src/common/types/node.env.types';

const sharedBullAsyncConfiguration: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<BullModuleOptions> => {
    const nodeEnv = configService.get<TNodeEnv>('NODE_ENV');
    switch (nodeEnv) {
      case 'production':
      case 'stagging':
        return {
          redis: {
            host: configService.get<string>('CORE_REDIS_HOST'),
            port: configService.get<number>('CORE_REDIS_PORT'),
            password: configService.get<string>('CORE_REDIS_PASSWORD'),
          },
        };
      default:
        return {
          redis: {
            enableOfflineQueue: true,
          },
        };
    }
  },
  inject: [ConfigService],
};

export default sharedBullAsyncConfiguration;
