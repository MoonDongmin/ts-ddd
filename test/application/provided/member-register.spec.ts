import {MemberRegister}              from "@/application/provided/member-register";
import {createMemberRegisterRequest} from "../../domain/member-fixture";
import {Member}                      from "@/domain/member";
import {MemberStatus}                from "@/domain/member-status";
import {
    Test,
    TestingModule,
}                                    from "@nestjs/testing";
import {MemberModifyService}         from "@/application/member-modify.service";
import {SplearnTestConfiguration}    from "../../splearn-test-configuration";
import {MemberRegisterRequest}       from "@/domain/member-register-request";
import {validate}                    from "class-validator";
import {MemberQueryService}          from "@/application/member-query.service";

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
                MemberQueryService,
                {
                    provide: "MemberFinder",
                    useExisting: MemberQueryService,
                },
                MemberModifyService,
            ],
        }).compile();

        memberRegister = moduleFixture.get<MemberModifyService>(MemberModifyService);
    });

    it("register", async () => {
        const member: Member = await memberRegister.register(createMemberRegisterRequest());

        expect(member.id).toBeDefined();
        expect(member.getStatus).toEqual(MemberStatus.PENDING);
    });

    it("duplicatedEmailFail", async () => {
        const member: Member = await memberRegister.register(createMemberRegisterRequest());

        await expect(memberRegister.register(createMemberRegisterRequest()))
            .rejects
            .toThrow();
    });

    it("activate", async () => {
        let member: Member = await memberRegister.register(createMemberRegisterRequest());

        member = await memberRegister.activate(member.id);

        expect(member.getStatus).toEqual(MemberStatus.ACTIVE);
    });

    it("memberRegisterRequestFail ", async () => {
        const checkValidation = new MemberRegisterRequest("cook1008@gmail.com", "dongmin", "longsecret");

        await memberRegister.register(checkValidation);

        const errors = await validate(checkValidation);
        console.log(errors);
        expect(errors.length).toEqual(0);
    });
});
