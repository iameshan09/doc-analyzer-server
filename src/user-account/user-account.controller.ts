import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import BaseUserCredentialsDto from '../common/dto/base-user-credentials.dto';
import { Public } from 'src/common/decorators/public.decorator';
import BaseUserDto from '../common/dto/base-user.dto';
import type { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { MongoPlainJsObject } from 'src/common/types/mongoose.types';
import { UserAccount } from 'src/common/schemas/user-accout.schema';
import AccountVerificationJwtGuard from 'src/auth/guards/account-verification-jwt.guard';
import type { Response } from 'express';

@Controller('user-account')
export class UserAccountController {
  constructor(private readonly service: UserAccountService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: BaseUserCredentialsDto) {
    return this.service.signIn(body);
  }

  @Public()
  @Post('sign-up')
  async create(@Body() body: BaseUserDto) {
    return this.service.create(body);
  }

  @Public()
  @UseGuards(AccountVerificationJwtGuard)
  @Get('verify')
  async verify(
    @Req() req: RequestWithUser<MongoPlainJsObject<UserAccount>>,
    @Res() res: Response,
  ) {
    const redirectTo = await this.service.verify(req.user);
    res.redirect(redirectTo);
  }
}
