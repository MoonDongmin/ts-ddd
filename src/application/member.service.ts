import {MemberRegister}        from "@/application/provided/member-register";
import {Member}                from "@/domain/member";
import {MemberRegisterRequest} from "@/domain/member-register-request";
import {Injectable}            from "@nestjs/common";
import type {MemberRepository} from "@/application/required/member-repository";
import type {EmailSender}      from "@/application/required/email-sender";
import type {PasswordEncoder}  from "@/domain/password-encoder";

@Injectable()
export class MemberService implements MemberRegister {
    constructor(
        private readonly memberRepository: MemberRepository,
        private readonly emailSender: EmailSender,
        private readonly passwordEncoder: PasswordEncoder,
    ) {
    }

    async register(registerRequest: MemberRegisterRequest): Promise<Member> {
        //check

        // domain model
        const member: Member = Member.register(registerRequest, this.passwordEncoder);

        // repository
        await this.memberRepository.save(member);

        // post process
        this.emailSender.send(member.getEmail, "등록을 완료해주세요", "아래 링크를 클릭해서 등록을 완료해주세요");

        return member;
    }
}
