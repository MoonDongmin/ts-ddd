import assert from 'node:assert';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '@/domain/member/profile';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update-request';

@Entity()
export class MemberDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'profile_address',
    type: 'varchar',
    nullable: true,
    transformer: {
      to: (value: Profile | null) => (value ? value.address : null),
      from: (value: string | null) => (value ? new Profile(value) : null),
    },
    unique: true,
    length: 20,
  })
  profile: Profile;

  @Column({
    type: 'text',
    nullable: true,
  })
  introduction: string;

  @Column({ nullable: false })
  registeredAt: Date;

  @Column({ nullable: true })
  activatedAt: Date;

  @Column({ nullable: true })
  deactivatedAt: Date;

  public static create(): MemberDetail {
    const memberDetail: MemberDetail = new MemberDetail();
    memberDetail.registeredAt = new Date(Date.now() + 9 * 60 * 60 * 1000);
    return memberDetail;
  }

  getId(): number {
    return this.id;
  }

  getProfile(): Profile {
    return this.profile;
  }

  getIntroduction(): string {
    return this.introduction;
  }

  getRegisteredAt(): Date {
    return this.registeredAt;
  }

  getActivatedAt(): Date {
    return this.activatedAt;
  }

  getDeactivatedAt(): Date {
    return this.deactivatedAt;
  }

  activate(): void {
    assert(
      this.activatedAt === undefined,
      '이미 activatedAt은 설정되었습니다.',
    );

    this.activatedAt = new Date(Date.now() + 9 * 60 * 60 * 1000);
  }

  deactivate(): void {
    assert(
      this.deactivatedAt === undefined,
      '이미 deactivatedAt은 설정되었습니다.',
    );

    this.deactivatedAt = new Date(Date.now() + 9 * 60 * 60 * 1000);
  }

  updateInfo(updateRequest: MemberInfoUpdateRequest) {
    this.profile = new Profile(updateRequest.profileAddress);
    this.introduction = updateRequest.introduction!;
  }
}
