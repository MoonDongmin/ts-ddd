import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Member } from '@/domain/member/member';
import { MemberModule } from '@/application/member/member.module';
import { MemberDetail } from '@/domain/member/member-detail';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 13306,
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [Member, MemberDetail],
      synchronize: true,
    }),
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
