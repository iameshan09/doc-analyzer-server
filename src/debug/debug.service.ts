import * as bcrypt from 'bcryptjs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { BadRequestException, Injectable } from '@nestjs/common';
import DebugPlacePhotoResponseDto from './dto/debug.place.photo.response.dto';
import { ConfigService } from '@nestjs/config';
import Route53Service from 'src/common/services/route53.service';
import { InjectQueue } from '@nestjs/bull';
import APP_QUEUE_NAMES from 'src/common/constants/app-queue-names';
import type { Queue } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import mailTemplates from 'src/common/constants/mail.templates';
import mailSubjects from 'src/common/constants/mail.subjects';
import cmsOutputJson from '../json/cms-output-debug.json';
import { CCLandingPageSchema } from 'src/common/zod-schemas/cc-landing-page-zod-schema';
import { transformCMSOutput } from 'src/common/utils/transform-cms-output';
import { LandingPageSchema } from 'src/common/zod-schemas/landing-page-zod-schema';
import CustomAiService from 'src/common/services/custom-ai.service';
import GeminiService from 'src/common/services/gemini.service';
import {
  storyJsonSchema,
  TStoryJson,
} from 'src/common/zod-schemas/story-json.zod.schema';
import { generateUniqueId } from 'src/common/utils/nanoid.utils';

@Injectable()
export class DebugService {
  private serverIp: string;
  private hostedZoneId: string;
  private domainName: string;
  private rounds: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly route53Service: Route53Service,
    private readonly customAiService: CustomAiService,
    private readonly geminiService: GeminiService,
    @InjectQueue(APP_QUEUE_NAMES.mailerQ)
    private readonly mailQ: Queue<ISendMailOptions>,
  ) {
    this.serverIp = this.configService.get<string>('SERVER_IP') as string;
    this.hostedZoneId = this.configService.get<string>(
      'ROUTE53_HOSTED_ZONE_ID',
    ) as string;
    this.domainName = this.configService.get<string>('DOMAIN_NAME') as string;
    this.rounds = this.configService.get<number>(
      'BCRYPT_SALT_ROUNDS',
    ) as number;
  }

  async debugRoute53CreateArecord(subdomain: string) {
    return this.route53Service.createARecord(
      this.hostedZoneId,
      `${subdomain}.${this.domainName}`,
      this.serverIp,
    );
  }

  async hashPassowrd(password: string) {
    const salt = await bcrypt.genSalt(this.rounds);
    return bcrypt.hash(password, salt);
  }

  async sendAccountActivationEmail() {
    await this.mailQ.add({
      to: 'iameshan09@gmail.com',
      template: mailTemplates.accountVerification,
      subject: mailSubjects.accountVerification,
      context: {
        recipient: 'Eshan',
        href: 'https://awb-admin.eshan.space/dashboard',
        from: 'AWB Team',
      },
    });
  }

  async validateCmsOutput() {
    const result = CCLandingPageSchema.safeParse(cmsOutputJson);
    if (!result.success)
      throw new BadRequestException(
        `cmsOutput not in expected format. errors:`,
        result.error.message,
      );
    const transformedOutput = transformCMSOutput(result.data);
    const outputBResult = LandingPageSchema.safeParse(transformedOutput);
    if (!outputBResult.success)
      throw new BadRequestException(
        `transformedOutput not in expected format. errors:`,
        outputBResult.error.message,
      );
    return outputBResult.data;
  }

  async readTextFiles(directoryPath: string): Promise<string[]> {
    try {
      // 1. Read all file names in the directory
      const fileNames = await fs.readdir(directoryPath);

      // 2. Filter for only .txt files
      const txtFiles = fileNames.filter(
        (file) => path.extname(file) === '.txt',
      );

      if (txtFiles.length === 0) {
        return [];
      }

      // 3. Read content of all files in parallel
      const fileContents = await Promise.all(
        txtFiles.map(async (fileName) => {
          const filePath = path.join(directoryPath, fileName);
          // 'utf-8' ensures you get a string back, not a Buffer
          return fs.readFile(filePath, 'utf-8');
        }),
      );

      return fileContents;
    } catch (error) {
      throw error; // Or return [] if you prefer to suppress errors
    }
  }

  async generateStoryTemplate() {
    const previouslyGeneratedTemplates = await this.readTextFiles('./temp');

    const prompt = `Create React Function Component in Typescript which accept prop named data. The component should present the data as story using very attractive UI. User experience should be highly prioritized. Use tailwind and shadcn-ui/ui
. Return all the code including import statements. Create Resusable components in a same file. Using next/image for images. Next.js version is "next": "16.0.7". Here are already generated outputs : ${previouslyGeneratedTemplates}, don't repeat the same design. Always return a new unique template.

prop data type description:

It contains:

name

A non-empty string

The title of the story

plot

A non-empty string

A short summary of the story

parts

An array with at least one item, ordered from start to finish

Each item is a page of the story and includes:

text: non-empty text for that page

imageUrl: a valid URL of the image for that page

type:

"cover" → the starting page, showing the story title

"story" → a regular story page

end

A valid URL

The ending image URL, representing the final scene of the story
`;

    const text = await this.geminiService.generateText(prompt);

    await fs.writeFile(
      `./temp/story-template-${generateUniqueId(5)}.txt`,
      text,
    );

    return text;
  }
}
