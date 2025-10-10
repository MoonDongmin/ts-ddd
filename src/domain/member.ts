import {MemberStatus}          from "@/domain/member-status";
import assert                  from "node:assert";
import {PasswordEncoder}       from "@/domain/password-encoder";
import {MemberRegisterRequest} from "@/domain/member-register-request";
import {Email}                 from "@/domain/email";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
}                              from "typeorm";

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        transformer: {
            // 데이터베이스에 저장할 때는 문자열로 변환
            to: (email: Email) => (email ? email.address : null),

            // 데이터베이스에서 읽어올 때는 Email 객체로 변환
            from: (emailString: string) =>
                emailString ? new Email(emailString) : null,
        },
    })
    email!: Email;

    @Column()
    nickname!: string;

    @Column()
    passwordHash!: string;

    @Column({
        type: "simple-enum",
        enum: MemberStatus,
        default: MemberStatus.PENDING,
    })
    status!: MemberStatus;

    public static register(createRequest: MemberRegisterRequest, passwordEncoder: PasswordEncoder): Member {
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


