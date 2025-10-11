import {MemberRegister}              from "@/application/provided/member-register";
import {createMemberRegisterRequest} from "../../domain/member-fixture";
import {Member}                      from "@/domain/member";
import {MemberStatus}                from "@/domain/member-status";
import {
    Test,
    TestingModule,
}                                    from "@nestjs/testing";
import {MemberService}               from "@/application/member.service";
import {SplearnTestConfiguration}    from "../../splearn-test-configuration";

describe("MemberRegisterTest", () => {
    let memberRegister: MemberRegister;

    beforeEach(async () => {
        const {
            mockMemberRepository,
            mockEmailSender,
            mockPasswordEncoder,
        } = SplearnTestConfiguration();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                MemberService,
                {
                    provide: "MemberRepository",
                    useValue: mockMemberRepository,
                },
                {
                    provide: "EmailSender",
                    useValue: mockEmailSender,
                },
                {
                    provide: "PasswordEncoder",
                    useValue: mockPasswordEncoder,
                },
            ],
        }).compile();

        memberRegister = moduleFixture.get<MemberService>(MemberService);
    });

    it("register", async () => {
        const member: Member = await memberRegister.register(createMemberRegisterRequest());

        expect(member.id).toBeDefined();
        expect(member.getStatus).toEqual(MemberStatus.PENDING);
    });

    it("duplicatedEmailFail", async () => {
        const member: Member = await memberRegister.register(createMemberRegisterRequest());

        await expect( memberRegister.register(createMemberRegisterRequest()))
            .rejects
            .toThrow();
    });
});
