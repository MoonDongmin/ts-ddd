import { PasswordEncoder } from '@/domain/member/password-encoder';
import { MemberRegisterRequest } from '@/domain/member/member-register-request';

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
