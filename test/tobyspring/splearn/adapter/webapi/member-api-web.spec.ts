import 'reflect-metadata';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { Member }                                from '@/domain/member/member';
import { MemberRegister }                        from '@/application/member/provided/member-register';
import { MemberModifyService }                   from '@/application/member/member-modify.service';
import { MemberQueryService }                    from '@/application/member/member-query.service';
import { Test, TestingModule }                   from '@nestjs/testing';
import { MemberApi }                             from '@/adapter/webapi/member-api';
import { SplearnTestConfiguration }              from '../../../../splearn-test-configuration';
import {
  createMember,
  createMemberRegisterRequest,
  toRegisterRequestBody,
}                                                from '../../domain/member/member-fixture';
import request                                   from 'supertest';
import { Response } from 'supertest';

describe('MemberApiTest', () => {
  let app: INestApplication;
  let memberRegister: MemberRegister;

  beforeAll(async () => {
    const { mockMemberRepository, mockEmailSender, mockPasswordEncoder } =
      SplearnTestConfiguration();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MemberApi],
      providers: [
        {
          provide: 'MemberRepository',
          useValue: mockMemberRepository,
        },
        {
          provide: 'EmailSender',
          useValue: mockEmailSender,
        },
        {
          provide: 'PasswordEncoder',
          useValue: mockPasswordEncoder,
        },
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    memberRegister =
      moduleFixture.get<MemberModifyService>(MemberModifyService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('register', async () => {
    const member: Member = createMember(1);

    const response: Response = await request(app.getHttpServer())
      .post('/api/members')
      .send(toRegisterRequestBody(member));

    expect(response.statusCode).toEqual(201);
    expect(response.body.memberId).toBeDefined();
    expect(response.body.memberId).toEqual(1);
  });

  it('registerFail', async () => {
    const member = createMemberRegisterRequest('invalid email');

    const response: Response = await request(app.getHttpServer())
      .post('/api/members')
      .send(member);

    expect(response.statusCode).toEqual(400);
  });
});
