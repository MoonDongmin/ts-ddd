import { Member } from '@/domain/member/member';

export interface MemberFinder {
  find(memberId: number): Promise<Member>;
}
