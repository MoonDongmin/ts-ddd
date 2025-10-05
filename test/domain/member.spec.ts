import {Member}              from "@/domain/member";
import {MemberStatus}        from "@/domain/member-status";
import {PasswordEncoder}     from "@/domain/password-encoder";
import {MemberCreateRequest} from "@/domain/member-create-request";

describe("Member Test", () => {
    let member: Member;
    let passwordEncoder: PasswordEncoder;

    beforeEach(() => {
        passwordEncoder = {
            encode(password: string): string {
                return password.toUpperCase();
            },
            matches(this: PasswordEncoder, password: string, passwordHash: string) {
                return this.encode(password) === passwordHash;
            },
        };
        member = Member.create(new MemberCreateRequest(
            "dongmin@naver.com",
            "Dongmin",
            "secret",
        ), passwordEncoder);
    });


    it("createMember", () => {
        expect(member.getStatus).toEqual(MemberStatus.PENDING);
    });

    // it("constructorNullCheck", () => {
    //     expect(() => Member.create(null, "Dongmin", "secret", passwordEncoder))
    //         .toThrow();
    // });

    it("activate", () => {
        member.activate();

        expect(member.getStatus).toEqual(MemberStatus.ACTIVE);
    });

    it("activateFail", () => {
        member.activate();

        expect(() => member.activate()).toThrow();
    });

    it("deactivate", () => {
        member.activate();

        member.deactivate();

        expect(member.getStatus).toEqual(MemberStatus.DEACTIVATED);
    });

    it("deactivateFail", () => {
        expect(() => member.deactivate()).toThrow();

        member.activate();
        member.deactivate();

        expect(() => member.deactivate()).toThrow();
    });

    it("verifyPassword", () => {
        expect(member.verifyPassword("secret", passwordEncoder)).toBeTruthy();
        expect(member.verifyPassword("hello", passwordEncoder)).toBeFalsy();
    });

    it("changeNickname", () => {
        expect(member.getNickname).toEqual("Dongmin");

        member.changeNickname("Dongmin2");

        expect(member.getNickname).toEqual("Dongmin2");
    });

    it("changePassword", () => {
        member.changePassword("verysecret", passwordEncoder);

        expect(member.verifyPassword("verysecret", passwordEncoder)).toBeTruthy();
    });

    it("isActive", () => {
        expect(member.isActive()).toBeFalsy();

        member.activate();

        expect(member.isActive()).toBeTruthy();

        member.deactivate();

        expect(member.isActive()).toBeFalsy();
    });
});
