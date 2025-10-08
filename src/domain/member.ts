import {MemberStatus}        from "@/domain/member-status";
import assert                from "node:assert";
import {PasswordEncoder}     from "@/domain/password-encoder";
import {MemberCreateRequest} from "@/domain/member-create-request";
import {Email}               from "@/domain/email";

export class Member {
    email!: Email;

    nickname!: string;

    passwordHash!: string;

    status!: MemberStatus;

    public static create(createRequest: MemberCreateRequest, passwordEncoder: PasswordEncoder): Member {
        const member: Member = new Member();

        member.email = new Email(createRequest.email);
        member.nickname = createRequest.nickname!;
        member.passwordHash = passwordEncoder.encode(createRequest.password)!;

        member.status = MemberStatus.PENDING;

        return member;
    }

    get getEmail(): Email {
        return this.email;
    }

    get getNickname(): string {
        return this.nickname;
    }

    get getPasswordHash(): string {
        return this.passwordHash;
    }

    get getStatus(): MemberStatus {
        return this.status;
    }

    public activate(): void {
        assert(this.status === MemberStatus.PENDING, "PENDING 상태가 아닙니다.");

        this.status = MemberStatus.ACTIVE;
    }

    public deactivate(): void {
        assert(this.status === MemberStatus.ACTIVE, "ACTIVE 상태가 아닙니다.");

        this.status = MemberStatus.DEACTIVATED;
    }

    verifyPassword(password: string, passwordEncoder: PasswordEncoder): boolean {
        return passwordEncoder.matches(password, this.passwordHash);
    }

    changeNickname(nickname: string): void {
        this.nickname = nickname!;
    }

    changePassword(password: string, passwordEncoder: PasswordEncoder): void {
        this.passwordHash = passwordEncoder.encode(password!);
    }

    isActive(): boolean {
        return this.status === MemberStatus.ACTIVE;
    }
}


