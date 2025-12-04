import { MemberStatus } from '@/domain/member/member-status';
import assert from 'node:assert';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import { MemberRegisterRequest } from '@/domain/member/member-register-request';
import { Email } from '@/domain/shared/email';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberDetail } from '@/domain/member/member-detail';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update-request';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    name: 'email_address',
    type: 'varchar',
    transformer: {
      // 데이터베이스에 저장할 때는 문자열로 변환
      to: (email: Email) => (email ? email.address : null),

      // 데이터베이스에서 읽어올 때는 Email 객체로 변환
      from: (emailString: string) =>
        emailString ? new Email(emailString) : null,
    },
    unique: true,
    length: 150,
    nullable: false,
  })
  email!: Email;

  @Column({
    length: 100,
    nullable: false,
  })
  nickname!: string;

  @Column({
    length: 200,
    nullable: false,
  })
  passwordHash!: string;

  @Column({
    type: 'simple-enum',
    enum: MemberStatus,
    default: MemberStatus.PENDING,
    nullable: false,
  })
  status!: MemberStatus;

  @OneToOne(() => MemberDetail, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @JoinColumn({ name: 'detail_id' })
  detail: MemberDetail;

  public static register(
    createRequest: MemberRegisterRequest,
    passwordEncoder: PasswordEncoder,
  ): Member {
    const member: Member = new Member();

    member.email = new Email(createRequest.email);
    member.nickname = createRequest.nickname!;
    member.passwordHash = passwordEncoder.encode(createRequest.password)!;

    member.status = MemberStatus.PENDING;

    member.detail = MemberDetail.create();

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

  get getDetail(): MemberDetail {
    return this.detail;
  }

  public activate(): void {
    assert(this.status === MemberStatus.PENDING, 'PENDING 상태가 아닙니다.');

    this.status = MemberStatus.ACTIVE;
    this.detail.activate();
  }

  public deactivate(): void {
    assert(this.status === MemberStatus.ACTIVE, 'ACTIVE 상태가 아닙니다.');

    this.status = MemberStatus.DEACTIVATED;
    this.detail.deactivate();
  }

  verifyPassword(password: string, passwordEncoder: PasswordEncoder): boolean {
    return passwordEncoder.matches(password, this.passwordHash);
  }

  updateInfo(updateRequest: MemberInfoUpdateRequest): void {
    assert(
      this.status === MemberStatus.ACTIVE,
      '등록 완료 상태가 아니면 정보를 수정할 수 없습니다.',
    );
    this.nickname = updateRequest.nickname!;

    this.detail.updateInfo(updateRequest);
  }

  changePassword(password: string, passwordEncoder: PasswordEncoder): void {
    this.passwordHash = passwordEncoder.encode(password!);
  }

  isActive(): boolean {
    return this.status === MemberStatus.ACTIVE;
  }
}
