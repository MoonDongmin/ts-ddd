import { MemberRegister } from '@/application/member/provided/member-register';
import { SplearnTestConfiguration } from '../../splearn-test-configuration';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { MemberFinder } from '@/application/member/provided/member-finder';
import { Member } from '@/domain/member/member';
import { createMemberRegisterRequest } from '../../domain/member/member-fixture';
import { MemberQueryService } from '@/application/member/member-query.service';

describe('MemberFinderTest', () => {
  let memberFinder: MemberFinder;
  let memberRegister: MemberRegister;

  beforeEach(async () => {
    const { mockMemberRepository, mockEmailSender, mockPasswordEncoder } =
      SplearnTestConfiguration();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MemberRepository',
          useValue: mockMemberRepository,
        },
        {
          provide: 'EmailSender',
          useValue: mockEmailSender,
        },
        {
          provide: 'PasswordEncoder',
          useValue: mockPasswordEncoder,
        },
        MemberQueryService,
        {
          provide: 'MemberFinder',
          useExisting: MemberQueryService,
        },
        MemberModifyService,
      ],
    }).compile();

    memberRegister =
      moduleFixture.get<MemberModifyService>(MemberModifyService);
    memberFinder = moduleFixture.get<MemberQueryService>(MemberQueryService);
  });

  it('find', async () => {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    const found: Member = await memberFinder.find(member.id);

    expect(member.id).toEqual(found.id);
  });

  it('finderFail', async () => {
    await expect(memberFinder.find(999)).rejects.toThrow();
  });
});
