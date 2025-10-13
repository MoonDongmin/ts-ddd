import {Member} from "@/domain/member";

export interface MemberFinder {
    find(memberId: number): Promise<Member>;
}
