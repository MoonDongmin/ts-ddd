import {
  HttpStatus,
  INestApplication,
}                                    from "@nestjs/common";
import {MemberRegister}              from "@/application/member/provided/member-register";
import {MemberRepository}            from "@/application/member/required/repository.port";
import {SplearnTestConfiguration}    from "../../splearn-test-configuration";
import {
  Test,
  TestingModule,
}                                    from "@nestjs/testing";
import {MemberApi}                   from "@/adapter/webapi/member-api";
import {MemberQueryService}          from "@/application/member/member-query.service";
import {MemberModifyService}         from "@/application/member/member-modify.service";
import {createMemberRegisterRequest} from "../../domain/member/member-fixture";
import request                       from "supertest";
import {Response}                    from "supertest";
import {Member}                      from "@/domain/member/member";
import {MemberStatus}                from "@/domain/member/member-status";
import {APP_FILTER}                  from "@nestjs/core";
import {ApiControllerAdvice}         from "@/adapter/api.controller.advice";

describe("MemberApiTest", () => {
  let app: INestApplication;
  let memberRegister: MemberRegister;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const {
      mockMemberRepository,
      mockEmailSender,
      mockPasswordEncoder,
    } =
      SplearnTestConfiguration();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MemberApi],
      providers: [
        {
          provide: "MemberRepository",
          useValue: mockMemberRepository,
        },
        {
          provide: "EmailSender",
          useValue: mockEmailSender,
        },
        {
          provide: "PasswordEncoder",
          useValue: mockPasswordEncoder,
        },
        MemberQueryService,
        {
          provide: "MemberFinder",
          useExisting: MemberQueryService,
        },
        MemberModifyService,
        {
          provide: "MemberRegister",
          useExisting: MemberModifyService,
        },
        {
          provide: APP_FILTER,
          useClass: ApiControllerAdvice,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    memberRegister = moduleFixture.get<MemberModifyService>(MemberModifyService);
    memberRepository = moduleFixture.get<MemberRepository>("MemberRepository");
  });

  afterAll(async () => {
    await app.close();
  });

  it("register", async () => {
    const registerRequest = createMemberRegisterRequest();
    const requestBody = {
      email: registerRequest.email,
      nickname: registerRequest.nickname,
      password: registerRequest.password,
    };

    const response: Response = await request(app.getHttpServer())
      .post("/api/members")
      .set("Content-Type", "application/json")
      .send(requestBody);

    expect(response).toBeDefined();
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.memberId).toBeDefined();
    expect(response.body.email).toBe(registerRequest.email);

    const member: Member | undefined = await memberRepository.findById(
      response.body.memberId,
    );

    expect(member).toBeDefined();
    expect(member!.getEmail.address).toBe(registerRequest.email);
    expect(member!.getNickname).toBe(registerRequest.nickname);
    expect(member!.getStatus).toBe(MemberStatus.PENDING);
  });

  it("duplicateEmail", async () => {
    const existingRequest = createMemberRegisterRequest();
    await memberRegister.register(existingRequest);

    const duplicateRequestBody = {
      email: existingRequest.email,
      nickname: existingRequest.nickname,
      password: existingRequest.password,
    };

    const response: Response = await request(app.getHttpServer())
      .post("/api/members")
      .set("Content-Type", "application/json")
      .send(duplicateRequestBody);

    console.log("Response body:", response.body);

    expect(response.status).toBe(HttpStatus.CONFLICT);
  });
});
