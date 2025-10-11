import {MemberRegister}   from "@/application/provided/member-register";
import {MemberService}    from "@/application/member.service";
import {
    createMemberRegisterRequest,
    createPasswordEncoder,
}                         from "../../domain/member-fixture";
import {MemberRepository} from "@/application/required/member-repository";
import {Member}           from "@/domain/member";
import {EmailSender}      from "@/application/required/email-sender";
import {Email}            from "@/domain/email";
import {MemberStatus}     from "@/domain/member-status";

describe("MemberRegisterTest", () => {
    it("registerTestStub", async () => {
        const register: MemberRegister = new MemberService(
            new MemberRepositoryStub(),
            new EmailSenderStub(),
            createPasswordEncoder(),
        );

        const member: Member = await register.register(createMemberRegisterRequest());

        expect(member.id).toBeDefined();
        expect(member.getStatus).toEqual(MemberStatus.PENDING);
    });

    it("registerTestMock", async () => {
        const emailSenderMock: EmailSenderMock = new EmailSenderMock();

        const register: MemberRegister = new MemberService(
            new MemberRepositoryStub(),
            emailSenderMock,
            createPasswordEncoder(),
        );

        const member: Member = await register.register(createMemberRegisterRequest());

        expect(member.id).toBeDefined();
        expect(member.getStatus).toEqual(MemberStatus.PENDING);

        expect(emailSenderMock.getTos).toHaveLength(1);
        expect(emailSenderMock.getTos[0]).toEqual(member.getEmail);
    });

    it("registerTestMockFramework", async () => {
        const emailSenderMock = {
            send: jest.fn(),
        } as EmailSender;

        const register: MemberRegister = new MemberService(
            new MemberRepositoryStub(),
            emailSenderMock,
            createPasswordEncoder(),
        );

        const member: Member = await register.register(createMemberRegisterRequest());

        expect(member.id).toBeDefined();
        expect(member.getStatus).toEqual(MemberStatus.PENDING);

        expect(emailSenderMock.send).toHaveBeenCalledTimes(1);
        expect(emailSenderMock.send).toHaveBeenCalledWith(
            member.getEmail,
            expect.any(String),
            expect.any(String),
        );
    });

    class MemberRepositoryStub implements MemberRepository {
        findByEmail(email: Email): Promise<Member> {
            return null;
        }

        async save(member: Member): Promise<Member> {
            member.id = 1;
            return member;
        }

    }

    class EmailSenderStub implements EmailSender {
        send(email: Email, subject: string, body: string): void {
        }
    }

    class EmailSenderMock implements EmailSender {
        private _tos: Email[] = [];

        send(email: Email, subject: string, body: string): void {
            this._tos.push(email);
        }

        get getTos(): Email[] {
            return this._tos;
        }
    }
});



