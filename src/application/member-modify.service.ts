import {MemberRegister}          from "@/application/provided/member-register";
import {Member}                  from "@/domain/member";
import {MemberRegisterRequest}   from "@/domain/member-register-request";
import {
    BadRequestException,
    Inject,
    Injectable,
}                                from "@nestjs/common";
import type {MemberRepository}   from "@/application/required/member-repository";
import type {EmailSender}        from "@/application/required/email-sender";
import type {PasswordEncoder}    from "@/domain/password-encoder";
import {Email}                   from "@/domain/email";
import {DuplicateEmailException} from "@/domain/duplicate-email.exception";
import type {MemberFinder}       from "@/application/provided/member-finder";

@Injectable()
export class MemberModifyService implements MemberRegister {
    constructor(
        @Inject("MemberFinder")
        private readonly memberFinder: MemberFinder,
        @Inject("MemberRepository")
        private readonly memberRepository: MemberRepository,
        @Inject("EmailSender")
        private readonly emailSender: EmailSender,
        @Inject("PasswordEncoder")
        private readonly passwordEncoder: PasswordEncoder,
    ) {
    }

    async register(registerRequest: MemberRegisterRequest): Promise<Member> {
        //check
        await this.checkDuplicateEmail(registerRequest);

        // domain model
        const member: Member = Member.register(registerRequest, this.passwordEncoder);

        // repository
        await this.memberRepository.save(member);

        // post process
        this.sendWelcomeEmail(member);

        return member;
    }

    async activate(memberId: number): Promise<Member> {
        const member: Member = await this.memberFinder.find(memberId);
        if (!member) {
            throw new BadRequestException("회원을 찾을 수 없습ㄴ디ㅏ. id: " + memberId);
        }

        member.activate();

        return this.memberRepository.save(member);
    }

    private sendWelcomeEmail(member: Member) {
        this.emailSender.send(member.getEmail, "등록을 완료해주세요", "아래 링크를 클릭해서 등록을 완료해주세요");
    }

    private async checkDuplicateEmail(registerRequest: MemberRegisterRequest) {
        const memberExist: Member = await this.memberRepository.findByEmail(new Email(registerRequest.email));
        if (memberExist) {
            throw new DuplicateEmailException("이미 사용중인 이메일입니다: " + registerRequest.email);
        }
    }


}
