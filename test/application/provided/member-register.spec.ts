import { MemberRegister } from '@/application/member/provided/member-register';
import { createMemberRegisterRequest } from '../../domain/member/member-fixture';
import { Member } from '@/domain/member/member';
import { MemberStatus } from '@/domain/member/member-status';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { SplearnTestConfiguration } from '../../splearn-test-configuration';
import { MemberRegisterRequest } from '@/domain/member/member-register-request';
import { validate } from 'class-validator';
import { MemberQueryService } from '@/application/member/member-query.service';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update-request';

describe('MemberRegisterTest', () => {
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
  });

  it('register', async () => {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    expect(member.id).toBeDefined();
    expect(member.getStatus).toEqual(MemberStatus.PENDING);
  });

  it('duplicatedEmailFail', async () => {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    await expect(
      memberRegister.register(createMemberRegisterRequest()),
    ).rejects.toThrow();
  });

  it('activate', async () => {
    let member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    member = await memberRegister.activate(member.id);

    expect(member.getStatus).toEqual(MemberStatus.ACTIVE);
    expect(member.getDetail.getActivatedAt()).toBeDefined();
  });

  async function registerMember(email?: string) {
    if (email) {
      let member: Member = await memberRegister.register(
        createMemberRegisterRequest(email),
      );

      return member;
    }

    let member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );
    return member;
  }

  it('deactivate', async () => {
    let member = await registerMember();

    await memberRegister.activate(member.id);

    member = await memberRegister.deactivate(member.id);

    expect(member.getStatus).toEqual(MemberStatus.DEACTIVATED);
    expect(member.getDetail.getDeactivatedAt()).toBeDefined();
  });

  it('updateInfo', async () => {
    let member = await registerMember();

    await memberRegister.activate(member.id);

    member = await memberRegister.updateInfo(
      member.id,
      new MemberInfoUpdateRequest('Peter', 'dongmin100', '자기소개'),
    );

    expect(member.getDetail.getProfile().address).toEqual('dongmin100');
  });

  it('updateInfoFail', async () => {
    let member: Member = await registerMember();
    await memberRegister.activate(member.id);
    await memberRegister.updateInfo(
      member.id,
      new MemberInfoUpdateRequest('Peter', 'dongmin100', '자기소개'),
    );

    let member2: Member = await registerMember('dongmin2@naver.com');
    await memberRegister.activate(member2.id);

    // member2는 기존의 member와 같은 profile을 사용할 수 없다.
    await expect(
      memberRegister.updateInfo(
        member2.id,
        new MemberInfoUpdateRequest('James', 'dongmin100', 'Introduction'),
      ),
    ).rejects.toThrow();

    // 다른 프로필 주소로는 변경 가능
    await memberRegister.updateInfo(
      member2.id,
      new MemberInfoUpdateRequest('James', 'dongmin101', 'Introduction'),
    );

    // 기존 프로필 주소를 바꾸는 것도 가능
    await memberRegister.updateInfo(
      member.id,
      new MemberInfoUpdateRequest('James', 'dongmin100', 'Introduction'),
    );

    // 프로필 주소를 제거하는 것도 가능
    await memberRegister.updateInfo(
      member.id,
      new MemberInfoUpdateRequest('James', '', 'Introduction'),
    );

    // 프로필 주소 중복은 허용하지 않음 (member2가 사용 중인 주소)
    await expect(
      memberRegister.updateInfo(
        member.id,
        new MemberInfoUpdateRequest('James', 'dongmin101', 'Introduction'),
      ),
    ).rejects.toThrow();
  });

  it('memberRegisterRequestFail ', async () => {
    const checkValidation = new MemberRegisterRequest(
      'cook1008@gmail.com',
      'dongmin',
      'longsecret',
    );

    await memberRegister.register(checkValidation);

    const errors = await validate(checkValidation);
    console.log(errors);
    expect(errors.length).toEqual(0);
  });
});
