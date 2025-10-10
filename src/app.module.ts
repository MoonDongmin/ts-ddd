import {Module}        from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule}  from "@nestjs/config";
import {Member}        from "@/domain/member";
import {MemberModule}  from "@/application/member.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "127.0.0.1",
            port: 13306,
            username: process.env.USER_NAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            entities: [Member],
            synchronize: true,
        }),
        MemberModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
