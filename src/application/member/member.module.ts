import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member/member';
import { MemberDetail } from '@/domain/member/member-detail';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { MemberQueryService } from '@/application/member/member-query.service';
import { DummyEmailSender } from '@/adapter/integration/dummy-email-sender';
import { SecurePasswordEncoder } from '@/adapter/security/secure-password-encoder';
import { MemberRepositoryImpl } from '@/adapter/persistence/member-typeorm-repository';
import { MemberApi } from '@/adapter/webapi/member-api';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberDetail])],
  controllers: [MemberApi],
  exports: [MemberModifyService, MemberQueryService],
  providers: [
    // Infrastructure providers first
    {
      provide: 'MemberRepository',
      useClass: MemberRepositoryImpl,
    },
    {
      provide: 'EmailSender',
      useClass: DummyEmailSender,
    },
    {
      provide: 'PasswordEncoder',
      useClass: SecurePasswordEncoder,
    },
    // Application services
    MemberQueryService,
    {
      provide: 'MemberFinder',
      useExisting: MemberQueryService,
    },
    MemberModifyService,
    {
      provide: 'MemberRegister',
      useExisting: MemberModifyService,
    },
  ],
})
export class MemberModule {}
