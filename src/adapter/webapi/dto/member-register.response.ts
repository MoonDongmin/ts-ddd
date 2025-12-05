import { Member } from '@/domain/member/member';

export class MemberRegisterResponse {
  memberId: number;

  email: string;

  constructor(memberId: number, email: string) {
    this.memberId = memberId;
    this.email = email;
  }

  static of(member: Member) {
    return new MemberRegisterResponse(member.id, member.getEmail.address);
  }
}
