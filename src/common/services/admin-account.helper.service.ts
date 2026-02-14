import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { trimAndLowercase } from '../utils/string.utils';
import { AdminAccount } from '../schemas/admin-accout.schema';

@Injectable()
class AdminAccountHelperService {
  constructor(
    @InjectModel(AdminAccount.name) private readonly model: Model<AdminAccount>,
  ) {}

  async findByIdOrThrow(id: string | Types.ObjectId) {
    const user = await this.model.findById(id);
    if (!user) throw new NotFoundException('Admin account not found');
    return user;
  }

  async findByEmailOrThrow(email: string) {
    const user = await this.model.findOne({
      email: trimAndLowercase(email),
    });
    if (!user) throw new NotFoundException('Admin account not found');
    return user;
  }

  async findByEmailAndThrow(email: string) {
    const user = await this.model.findOne({
      email: trimAndLowercase(email),
    });
    if (user)
      throw new ConflictException(`Admin account from ${email} already exist`);
  }
}

export default AdminAccountHelperService;
