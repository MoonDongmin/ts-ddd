import {Module}              from "@nestjs/common";
import {TypeOrmModule}       from "@nestjs/typeorm";
import {Member}              from "@/domain/member";
import {MemberModifyService} from "@/application/member-modify.service";
import {MemberQueryService}  from "@/application/member-query.service";
import {DummyEmailSender}    from "@/adapter/integration/dummy-email-sender";

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    exports: [MemberModifyService, MemberQueryService],
    providers: [MemberModifyService, MemberQueryService,
        {
            provide: "MemberFinder",
            useExisting: MemberQueryService,
        },
        {
            provide: "EmailSender",
            useClass: DummyEmailSender,
        },
        {
            provide: "PasswordEncoder",
            useValue: {
                encode: (password: string) => `encoded_${password}`,
                matches: (password: string, hash: string) => hash === `encoded_${password}`,
            },
        },
    ],
})
export class MemberModule {
}
