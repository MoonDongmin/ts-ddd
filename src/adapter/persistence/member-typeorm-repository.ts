import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '@/domain/member/member';
import { Email } from '@/domain/shared/email';
import { Profile } from '@/domain/member/profile';

@Injectable()
export class MemberRepositoryImpl {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  async save(member: Member): Promise<Member> {
    return this.repository.save(member);
  }

  async findByEmail(email: Email): Promise<Member | null> {
    return this.repository.findOne({
      where: { email: email as any },
    });
  }

  async findById(memberId: number): Promise<Member | null> {
    return this.repository.findOne({
      where: { id: memberId },
    });
  }

  async findByProfile(profile: Profile): Promise<Member | null> {
    return this.repository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.detail', 'detail')
      .where('detail.profile_address = :address', { address: profile.address })
      .getOne();
  }
}
