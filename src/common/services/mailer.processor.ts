import { Processor, Process } from '@nestjs/bull';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { WinstonLoggerService } from '../services/winston-logger.service';
import { Job } from 'bullmq';
import APP_QUEUE_NAMES from '../constants/app-queue-names';

/**
 * Background processor for handling email queue jobs
 */
@Processor(APP_QUEUE_NAMES.mailerQ)
export default class MailerProcessor {
  constructor(
    private readonly service: MailerService,
    private readonly logger: WinstonLoggerService,
  ) {}

  /**
   * Processes email sending jobs from the queue
   */
  @Process()
  async send({ data }: Job<ISendMailOptions>) {
    try {
      /** Send email using mailer service */
      await this.service.sendMail(data);
      this.logger.log(
        `Mail sent to ${data?.to as string} with subject "${data?.subject}"`,
      );
    } catch (error) {
      this.logger.error(`Failed to send mail: ${error?.message || error}`);
    }
  }
}
