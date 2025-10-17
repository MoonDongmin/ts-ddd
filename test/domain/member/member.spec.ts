import { Member } from '@/domain/member/member';
import { MemberStatus } from '@/domain/member/member-status';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import {
  createMemberRegisterRequest,
  createPasswordEncoder,
} from './member-fixture';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update-request';

describe('Member Test', () => {
  let member: Member;
  let passwordEncoder: PasswordEncoder;

  beforeEach(() => {
    passwordEncoder = createPasswordEncoder();
    member = Member.register(createMemberRegisterRequest(), passwordEncoder);
  });

  it('registerMember', () => {
    expect(member.getStatus).toEqual(MemberStatus.PENDING);
    expect(member.getDetail.getRegisteredAt()).toBeDefined();
  });

  // it("constructorNullCheck", () => {
  //     expect(() => Member.create(null, "Dongmin", "secret", passwordEncoder))
  //         .toThrow();
  // });

  it('activate', () => {
    expect(member.getDetail.getActivatedAt()).toBeUndefined();

    member.activate();

    expect(member.getStatus).toEqual(MemberStatus.ACTIVE);
    expect(member.getDetail.getActivatedAt()).toBeDefined();
  });

  it('activateFail', () => {
    member.activate();

    expect(() => member.activate()).toThrow();
  });

  it('deactivate', () => {
    member.activate();

    member.deactivate();

    expect(member.getStatus).toEqual(MemberStatus.DEACTIVATED);
    expect(member.getDetail.getDeactivatedAt()).toBeDefined();
  });

  it('deactivateFail', () => {
    expect(() => member.deactivate()).toThrow();

    member.activate();
    member.deactivate();

    expect(() => member.deactivate()).toThrow();
  });

  it('verifyPassword', () => {
    expect(member.verifyPassword('secret', passwordEncoder)).toBeTruthy();
    expect(member.verifyPassword('hello', passwordEncoder)).toBeFalsy();
  });

  it('changePassword', () => {
    member.changePassword('verysecret', passwordEncoder);

    expect(member.verifyPassword('verysecret', passwordEncoder)).toBeTruthy();
  });

  it('isActive', () => {
    expect(member.isActive()).toBeFalsy();

    member.activate();

    expect(member.isActive()).toBeTruthy();

    member.deactivate();

    expect(member.isActive()).toBeFalsy();
  });

  it('invalidEmail', () => {
    expect(() =>
      Member.register(
        createMemberRegisterRequest('invalid email'),
        passwordEncoder,
      ),
    ).toThrow();

    Member.register(createMemberRegisterRequest(), passwordEncoder);
  });

  it('updateInfo', () => {
    member.activate();

    let request = new MemberInfoUpdateRequest('Leo', 'dongmin100', '자기소개');
    member.updateInfo(request);

    expect(member.getNickname).toEqual(request.nickname);
    expect(member.getDetail.profile.address).toEqual(request.profileAddress);
    expect(member.getDetail.getIntroduction()).toEqual(request.introduction);
  });

  it('updateInfoFail', () => {
    expect(() => {
      const request = new MemberInfoUpdateRequest(
        'Leo',
        'dongmin100',
        '자기소개',
      );
      member.updateInfo(request);
    }).toThrow();
  });
});
