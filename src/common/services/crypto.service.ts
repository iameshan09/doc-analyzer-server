import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export default class CryptoService {
  hashBuffer(data: Buffer) {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(data);
    return hashSum.digest('hex');
  }
}
