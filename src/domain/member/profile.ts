import { BadRequestException } from '@nestjs/common';

export class Profile {
  private _address: string;
  private static readonly PROFILE_ADDRESS_PATTERN: RegExp = /^[a-z0-9]+$/;

  constructor(address: string) {
    if (
      address === null ||
      (address.length > 0 && !Profile.PROFILE_ADDRESS_PATTERN.test(address))
    ) {
      throw new Error('프로필 주소 형식이 바르지 않습니다: ' + address);
    }

    if (address.length > 15) {
      throw new BadRequestException(
        '프로필 주소는 최대 15자리를 넘을 수 없습니다.',
      );
    }
    this._address = address;
  }

  get address(): string {
    return this._address;
  }

  public url(): string {
    return '@' + this._address;
  }
}
