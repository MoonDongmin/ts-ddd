import {MemberStatus} from "@/domain/member-status";

export class Member {
    email: string;

    nickname: string;

    passwordHash: string;

    status: MemberStatus;

    constructor(email: string, nickname: string, passwordHash: string) {
        this.email = email;
        this.nickname = nickname;
        this.passwordHash = passwordHash;
        this.status = MemberStatus.PENDING;
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
}


