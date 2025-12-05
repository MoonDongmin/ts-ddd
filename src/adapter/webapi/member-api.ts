import { Body, Controller, Inject, Post } from '@nestjs/common';
import type { MemberRegister } from '@/application/member/provided/member-register';
import { MemberRegisterRequest } from '@/domain/member/member-register-request';
import { Member } from '@/domain/member/member';
import { MemberRegisterResponse } from '@/adapter/webapi/dto/member-register.response';

@Controller()
export class MemberApi {
  constructor(
    @Inject('MemberRegister')
    private readonly memberRegister: MemberRegister,
  ) {}

  @Post('/api/members')
  async register(
    @Body() request: MemberRegisterRequest,
  ): Promise<MemberRegisterResponse> {
    const member: Member = await this.memberRegister.register(request);

    return MemberRegisterResponse.of(member);
  }
}
