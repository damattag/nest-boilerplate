import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { IHashService } from './interface';

@Injectable()
export class HashService implements IHashService {
  hash(value: string): Promise<string> {
    return hash(value, 8);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
}
