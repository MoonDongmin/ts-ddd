export class Email {
    private readonly address: string;
    private static readonly EMAIL_PATTERN: RegExp =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;

    constructor(address: string) {
        if (!Email.EMAIL_PATTERN.test(address)) {
            throw new Error("이메일 형식이 바르지 않습니다: " + address);
        }
        this.address = address;
    }
}
