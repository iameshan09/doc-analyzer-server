import { Body, Controller, Post } from '@nestjs/common';
import { AdminAccountService } from './admin-account.service';
import { Public } from 'src/common/decorators/public.decorator';
import BaseUserCredentialsDto from 'src/common/dto/base-user-credentials.dto';

@Controller('admin-account')
export class AdminAccountController {
  constructor(private readonly service: AdminAccountService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: BaseUserCredentialsDto) {
    return this.service.signIn(body);
  }
}
