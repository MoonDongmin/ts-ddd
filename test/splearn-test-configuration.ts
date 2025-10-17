import { MemberRepository } from '@/application/member/required/member-repository';
import { Member } from '@/domain/member/member';
import { EmailSender } from '@/application/member/required/email-sender';
import { Email } from '@/domain/shared/email';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import { createPasswordEncoder } from './domain/member/member-fixture';
import { MemberFinder } from '@/application/member/provided/member-finder';
import { Profile } from '@/domain/member/profile';

export function SplearnTestConfiguration() {
  // In-Memory 상태 저장
  const members: Member[] = [];

  // Mock 의존성들
  const mockMemberRepository: MemberRepository = {
    findById: jest.fn(async (memberId: null) => {
      return members.find((m) => m.id === memberId);
    }),
    findByEmail: jest.fn(async (email: Email) => {
      // 저장된 회원 중에서 이메일로 검색
      return members.find((m) => m.getEmail.address === email.address) || null;
    }),
    save: jest.fn(async (member: Member) => {
      const existingIndex = members.findIndex((m) => m.id === member.id);

      if (existingIndex >= 0) {
        // 업데이트: 기존 회원 교체
        members[existingIndex] = member;
      } else {
        // 신규 등록: ID 할당하고 추가
        (member as any).id = members.length + 1;
        members.push(member);
      }

      return member;
    }),
    findByProfile: jest.fn(async (profile: Profile) => {
      return (
        members.find(
          (m) => m.getDetail.getProfile()?.address === profile.address,
        ) || null
      );
    }),
  };

  const mockEmailSender: EmailSender = {
    send(email: Email, subject: string, body: string) {
      console.log('Sending email: ' + email);
    },
  };

  const mockPasswordEncoder: PasswordEncoder = createPasswordEncoder();

  const mockMemberFinder: MemberFinder = {
    find: jest.fn(async (memberId: null) => {
      return members.find((m) => m.id === memberId);
    }),
  };

  return {
    mockMemberRepository,
    mockEmailSender,
    mockPasswordEncoder,
    mockMemberFinder,
  };
}
