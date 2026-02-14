import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

const templateDir = process.cwd() + '/src/mails/templates/views';
const partialDir = process.cwd() + '/src/mails/templates/partials';

export const mailerAsyncOptions: MailerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    return {
      transport: {
        host: config.getOrThrow<string>('SMTP_HOST'),
        port: config.getOrThrow<number>('SMTP_PORT'),
        secure: false,
        auth: {
          user: config.getOrThrow<string>('SMTP_USER'),
          pass: config.getOrThrow<string>('SMTP_PASS'),
        },
      },
      defaults: {
        from: config.getOrThrow<string>('SES_SOURCE_EMAIL'),
      },
      template: {
        dir: templateDir,
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
          inlineCssOptions: {},
        }),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: partialDir,
          options: {
            strict: true,
          },
        },
      },
    };
  },
  inject: [ConfigService],
};
