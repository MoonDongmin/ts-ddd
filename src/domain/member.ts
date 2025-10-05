import {MemberStatus}    from "@/domain/member-status";
import assert            from "node:assert";
import {PasswordEncoder} from "@/domain/password-encoder";

export class Member {
    email!: string;

    nickname!: string;

    passwordHash!: string;

    status!: MemberStatus;

    private constructor(email: string, nickname: string, passwordHash: string) {
        if (!email) {
            throw new Error("Email cannot be null or empty");
        }

        if (!nickname) {
            throw new Error("Nickname cannot be null or empty");
        }

        this.email = email;
        this.nickname = nickname;
        this.passwordHash = passwordHash;
        this.status = MemberStatus.PENDING;
    }

    public static create(email: string, nickname: string, password: string, passwordEncoder: PasswordEncoder): Member {
        return new Member(email, nickname, passwordEncoder.encode(password));
    }

    get getEmail(): string {
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

    verifyPassword(password: string, passwordEncoder: PasswordEncoder) {
        return passwordEncoder.matches(password, this.passwordHash);
    }

    changeNickname(nickname: string) {
        this.nickname = nickname;
    }

    changePassword(password: string, passwordEncoder: PasswordEncoder) {
        this.passwordHash = passwordEncoder.encode(password);
    }
}


