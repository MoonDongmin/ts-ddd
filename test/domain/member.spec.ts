import {Member}       from "@/domain/member";
import {MemberStatus} from "@/domain/member-status";

describe("Member Test", () => {
    it("createMember", () => {
        const member: Member = new Member("dongmin@naver.com", "Doming", "secret");

        expect(member.getStatus).toEqual(MemberStatus.PENDING);
    });
});
