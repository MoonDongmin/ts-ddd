import {Module}        from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Member}        from "@/domain/member";
import {MemberService} from "@/application/member.service";

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    exports: [MemberService],
    providers: [MemberService],
})
export class MemberModule {
}
