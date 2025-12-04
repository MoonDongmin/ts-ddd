import { MemberRegister } from '@/application/member/provided/member-register';
import { Member } from '@/domain/member/member';
import { MemberRegisterRequest } from '@/domain/member/member-register-request';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { MemberRepository } from '@/application/member/required/member-repository';
import type { EmailSender } from '@/application/member/required/email-sender';
import type { PasswordEncoder } from '@/domain/member/password-encoder';
import { Email } from '@/domain/shared/email';
import { DuplicateEmailException } from '@/domain/member/duplicate-email.exception';
import type { MemberFinder } from '@/application/member/provided/member-finder';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update-request';
import { Profile } from '@/domain/member/profile';
import { DuplicateProfileException } from '@/domain/member/duplicate-profile.exception';

@Injectable()
export class MemberModifyService implements MemberRegister {
  constructor(
    @Inject('MemberFinder')
    private readonly memberFinder: MemberFinder,
    @Inject('MemberRepository')
    private readonly memberRepository: MemberRepository,
    @Inject('EmailSender')
    private readonly emailSender: EmailSender,
    @Inject('PasswordEncoder')
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async register(registerRequest: MemberRegisterRequest): Promise<Member> {
    //check
    await this.checkDuplicateEmail(registerRequest);

    // domain model
    const member: Member = Member.register(
      registerRequest,
      this.passwordEncoder,
    );

    // repository
    await this.memberRepository.save(member);

    // post process
    this.sendWelcomeEmail(member);

    return member;
  }

  async activate(memberId: number): Promise<Member> {
    const member: Member = await this.memberFinder.find(memberId);
    if (!member) {
      throw new BadRequestException(
        '회원을 찾을 수 없습ㄴ디ㅏ. id: ' + memberId,
      );
    }

    member.activate();

    return this.memberRepository.save(member);
  }

  async deactivate(memberId: number): Promise<Member> {
    const member: Member = await this.memberFinder.find(memberId);

    if (!member) {
      throw new BadRequestException(
        '회원을 찾을 수 없습ㄴ디ㅏ. id: ' + memberId,
      );
    }

    member.deactivate();

    return this.memberRepository.save(member);
  }

  async updateInfo(
    memberId: number,
    memberInfoUpdateRequest: MemberInfoUpdateRequest,
  ): Promise<Member> {
    const member = await this.memberFinder.find(memberId);

    await this.checkDuplicateProfile(
      member,
      memberInfoUpdateRequest.profileAddress,
    );

    member.updateInfo(memberInfoUpdateRequest);

    return await this.memberRepository.save(member);
  }

  private async checkDuplicateProfile(member: Member, profileAddress: string) {
    if (!profileAddress) return;

    const currentAddress = member.getDetail?.getProfile()?.address;

    if (currentAddress === profileAddress) return;

    if (
      await this.memberRepository.findByProfile(new Profile(profileAddress))
    ) {
      throw new DuplicateProfileException(
        '이미 존재하는 프로필 주소입니다: ' + profileAddress,
      );
    }
  }

  private sendWelcomeEmail(member: Member) {
    this.emailSender.send(
      member.getEmail,
      '등록을 완료해주세요',
      '아래 링크를 클릭해서 등록을 완료해주세요',
    );
  }

  private async checkDuplicateEmail(registerRequest: MemberRegisterRequest) {
    const memberExist: Member = await this.memberRepository.findByEmail(
      new Email(registerRequest.email),
    );
    if (memberExist) {
      throw new DuplicateEmailException(
        '이미 사용중인 이메일입니다: ' + registerRequest.email,
      );
    }
  }
}
