import { PasswordEncoder }       from '@/domain/member/password-encoder';
import { MemberRegisterRequest } from '@/domain/member/member-register-request';
import { Member }                from '@/domain/member/member';

export function createPasswordEncoder() {
  return {
    encode(password: string): string {
      return password.toUpperCase();
    },
    matches(this: PasswordEncoder, password: string, passwordHash: string) {
      return this.encode(password) === passwordHash;
    },
  };
}

export function createMemberRegisterRequest(email?: string) {
  return new MemberRegisterRequest(
    email ? email : 'dongmin@naver.com',
    'Dongmin',
    'secret',
  );
}

export function createMember(id?: number): Member {
  if (id) {
    const member = Member.register(
      createMemberRegisterRequest(),
      createPasswordEncoder(),
    );
    member.id = id;

    return member;
  }

  return Member.register(
    createMemberRegisterRequest(),
    createPasswordEncoder(),
  );
}

export function toRegisterRequestBody(
  member: Member,
  password: string = 'secret',
) {
  return {
    email: member.getEmail.address,
    nickname: member.getNickname,
    password,
  };
}
