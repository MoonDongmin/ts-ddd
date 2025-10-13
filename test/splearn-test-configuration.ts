import {MemberRepository}      from "@/application/required/member-repository";
import {Member}                from "@/domain/member";
import {EmailSender}           from "@/application/required/email-sender";
import {Email}                 from "@/domain/email";
import {PasswordEncoder}       from "@/domain/password-encoder";
import {createPasswordEncoder} from "./domain/member-fixture";
import {MemberFinder}          from "@/application/provided/member-finder";

export function SplearnTestConfiguration() {
    // In-Memory 상태 저장
    const members: Member[] = [];

    // Mock 의존성들
    const mockMemberRepository: MemberRepository = {
        findById: jest.fn(async (memberId: null) => {
            return members.find(m => m.id === memberId);
        }),
        findByEmail: jest.fn(async (email: Email) => {
            // 저장된 회원 중에서 이메일로 검색
            return members.find(m => m.getEmail.address === email.address) || null;
        }),
        save: jest.fn(async (member: Member) => {
            // ID 할당 시뮬레이션
            (member as any).id = members.length + 1;
            // 실제로 배열에 저장
            members.push(member);
            return member;
        }),
    };

    const mockEmailSender: EmailSender = {
        send(email: Email, subject: string, body: string) {
            console.log("Sending email: " + email);
        },
    };

    const mockPasswordEncoder: PasswordEncoder = createPasswordEncoder();

    const mockMemberFinder: MemberFinder = {
        find: jest.fn(async (memberId: null) => {
            return members.find(m => m.id === memberId);
        }),
    };

    return {
        mockMemberRepository,
        mockEmailSender,
        mockPasswordEncoder,
        mockMemberFinder,
    };
}
