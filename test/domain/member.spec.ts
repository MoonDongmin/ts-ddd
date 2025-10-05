import {Member}       from "@/domain/member";
import {MemberStatus} from "@/domain/member-status";

describe("Member Test", () => {
    it("createMember", () => {
        const member: Member = new Member("dongmin@naver.com", "Doming", "secret");

        expect(member.getStatus).toEqual(MemberStatus.PENDING);
    });

    it("constructorNullCheck", () => {
        expect(() => new Member(null, "Dongmin", "secret"))
            .toThrow();
    });

    it("activate", () => {
        const member: Member = new Member("dongmin@naver.com", "Doming", "secret");

        member.activate();

        expect(member.getStatus).toEqual(MemberStatus.ACTIVE);
    });

    it("activateFail", () => {
        const member: Member = new Member("dongmin@naver.com", "Doming", "secret");

        member.activate();

        expect(() => member.activate()).toThrow();
    });

    it("deactivate", () => {
        const member: Member = new Member("dongmin@naver.com", "Doming", "secret");
        member.activate();

        member.deactivate();

        expect(member.getStatus).toEqual(MemberStatus.DEACTIVATED);
    });

    it("deactivateFail", () => {
        const member: Member = new Member("dongmin@naver.com", "Doming", "secret");

        expect(() => member.deactivate()).toThrow();

        member.activate();
        member.deactivate();

        expect(() => member.deactivate()).toThrow();
    });
});
