import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateProfileException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    this.name = 'DuplicateProfileException';
  }
}
