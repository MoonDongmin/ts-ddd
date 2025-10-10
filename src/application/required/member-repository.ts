import {Member} from "@/domain/member";

/**
 * 회원 정보를 저장하거나 조회한다
 */
export interface MemberRepository {
    save(member: Member): Member;
}
