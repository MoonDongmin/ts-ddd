import { Member } from '@/domain/member/member';
import {
  createMemberRegisterRequest,
  createPasswordEncoder,
} from '../../domain/member/member-fixture';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from '@/application/member/required/repository.port';
import { MemberDetail } from '@/domain/member/member-detail';
import { Email } from '@/domain/shared/email';
import { MemberStatus } from '@/domain/member/member-status';

class TypeOrmMemberRepositoryAdapter implements MemberRepository {
  constructor(private readonly repository: Repository<Member>) {}

  findByEmail(email: Email): Promise<Member | null> {
    throw new Error('Method not implemented.');
  }

  async findById(memberId: number): Promise<Member | null> {
    return await this.repository.findOneBy({ id: memberId });
  }

  async save(member: Member): Promise<Member> {
    return await this.repository.save(member);
  }
}

describe('MemberRepositoryTest', () => {
  let memberRepository: MemberRepository;
  let typeormRepository: Repository<Member>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Member, MemberDetail],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, MemberDetail]),
      ],
    }).compile();

    typeormRepository = moduleFixture.get<Repository<Member>>(
      getRepositoryToken(Member),
    );

    // Adapter를 통해 Port 인터페이스 사용
    memberRepository = new TypeOrmMemberRepositoryAdapter(typeormRepository);
  });

  it('createMember', async () => {
    const member: Member = Member.register(
      createMemberRegisterRequest(),
      createPasswordEncoder(),
    );

    expect(member.id).toBeUndefined();

    const createMember = await memberRepository.save(member);

    expect(createMember.id).toBeDefined();

    const fount = await memberRepository.findById(member.id);

    expect(fount?.getStatus).toEqual(MemberStatus.PENDING);
    expect(fount?.getDetail.getRegisteredAt).toBeDefined();
  });

  it('duplicateEmailFail', async () => {
    const member: Member = Member.register(
      createMemberRegisterRequest(),
      createPasswordEncoder(),
    );
    await memberRepository.save(member);

    const member2: Member = Member.register(
      createMemberRegisterRequest(),
      createPasswordEncoder(),
    );

    await expect(memberRepository.save(member2)).rejects.toThrow();
  });
});
