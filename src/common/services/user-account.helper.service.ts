import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAccount } from '../schemas/user-accout.schema';
import { Model, Types } from 'mongoose';
import { trimAndLowercase } from '../utils/string.utils';
import BaseUserDto from 'src/common/dto/base-user.dto';

@Injectable()
class UserAccountHelperService {
  constructor(
    @InjectModel(UserAccount.name) private readonly model: Model<UserAccount>,
  ) {}

  async findByIdOrThrow(id: string | Types.ObjectId) {
    const user = await this.model.findById(id);
    if (!user) throw new NotFoundException('User account not found');
    return user;
  }

  async findByEmailOrThrow(email: string) {
    const user = await this.model.findOne({
      email: trimAndLowercase(email),
    });
    if (!user) throw new NotFoundException('User account not found');
    return user;
  }

  async findByEmailAndThrow(email: string) {
    const user = await this.model.findOne({
      email: trimAndLowercase(email),
    });
    if (user)
      throw new ConflictException(`User account from ${email} already exist`);
  }

  // async create(body: BaseUserDto) {
  //   const model = new this.model(body);
  //   return model.save();
  // }
}

export default UserAccountHelperService;
