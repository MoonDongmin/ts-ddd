import {
    BadRequestException,
    Inject,
    Injectable,
}                              from "@nestjs/common";
import type {MemberRepository} from "@/application/required/member-repository";
import {MemberFinder}          from "@/application/provided/member-finder";
import {Member}                from "@/domain/member";

@Injectable()
export class MemberQueryService implements MemberFinder {
    constructor(
        @Inject("MemberRepository")
        private readonly memberRepository: MemberRepository,
    ) {
    }

    async find(memberId: number): Promise<Member> {
        const member: Member = await this.memberRepository.findById(memberId);
        if (!member) {
            throw new BadRequestException("회원을 찾을 수 없습니다. id: " + memberId);
        }

        return member;
    }
}

