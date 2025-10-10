import {Member}             from "@/domain/member";
import {
    createMemberRegisterRequest,
    createPasswordEncoder,
}                           from "../../domain/member-fixture";
import {Repository}         from "typeorm";
import {
    Test,
    TestingModule,
}                           from "@nestjs/testing";
import {TypeOrmModule}      from "@nestjs/typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {MemberRepository}   from "@/application/required/member-repository";

class TypeOrmMemberRepositoryAdapter implements MemberRepository {
    constructor(
        private readonly repository: Repository<Member>,
    ) {
    }

    async save(member: Member): Promise<Member> {
        return await this.repository.save(member);
    }

}

describe("MemberRepositoryTest", () => {
    let memberRepository: MemberRepository;
    let typeormRepository: Repository<Member>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: ":memory:",
                    entities: [Member],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([Member]),
            ],
        }).compile();

        typeormRepository = moduleFixture.get<Repository<Member>>(
            getRepositoryToken(Member),
        );

        // Adapter를 통해 Port 인터페이스 사용
        memberRepository = new TypeOrmMemberRepositoryAdapter(typeormRepository);
    });

    it("createMember", async () => {
        const member: Member = Member.register(
            createMemberRegisterRequest(),
            createPasswordEncoder(),
        );

        expect(member.id).toBeUndefined();

        const createMember = await memberRepository.save(member);

        expect(createMember.id).toBeDefined();
    });
});
