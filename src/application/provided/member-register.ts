import {MemberRegisterRequest} from "@/domain/member-register-request";
import {Member}                from "@/domain/member";

/**
 * 회원의 등록과 관련된 기능을 제공한다
 */
export interface MemberRegister {
    register(registerRequest: MemberRegisterRequest): Promise<Member>;
}
