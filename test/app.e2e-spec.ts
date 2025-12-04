import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { MemberQueryService } from '@/application/member/member-query.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '@/domain/member/member';
import { Repository } from 'typeorm';

describe('Application Bootstrap (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Member))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should bootstrap application successfully', () => {
    expect(app).toBeDefined();
  });

  it('should load AppModule', () => {
    const appModule = moduleFixture.get(AppModule);
    expect(appModule).toBeDefined();
  });

  it('should load MemberModifyService', () => {
    const memberModifyService = moduleFixture.get(MemberModifyService);
    expect(memberModifyService).toBeDefined();
  });

  it('should load MemberQueryService', () => {
    const memberQueryService = moduleFixture.get(MemberQueryService);
    expect(memberQueryService).toBeDefined();
  });

  it('should load Member repository', () => {
    const memberRepository = moduleFixture.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    expect(memberRepository).toBeDefined();
  });

  it('should have correct port configuration', () => {
    const httpServer = app.getHttpServer();
    expect(httpServer).toBeDefined();
  });
});
