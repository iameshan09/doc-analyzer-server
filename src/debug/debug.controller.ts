import { Body, Controller, Post } from '@nestjs/common';
import { DebugService } from './debug.service';
import { Public } from 'src/common/decorators/public.decorator';
import CreateARecordDto from './dto/create-a-record.dto';

@Controller('debug')
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  //@Public()
  @Post('route53/a-record')
  debugRoute53CreateArecord(@Body() body: CreateARecordDto) {
    return this.debugService.debugRoute53CreateArecord(body.subdomain);
  }

  @Public()
  @Post('bcrypt/hash')
  hashPassowrd(@Body() body: { password: string }) {
    return this.debugService.hashPassowrd(body.password);
  }

  @Public()
  @Post('email/account-activation')
  sendAccountActivationEmail() {
    return this.debugService.sendAccountActivationEmail();
  }

  @Public()
  @Post('validate/cms-output')
  debugValidateCmsOutput() {
    return this.debugService.validateCmsOutput();
  }

  //@Public()
  @Post('ai/generate-webpage')
  generateWebPageUsingAI() {
    return this.debugService.generateStoryTemplate();
  }
}
