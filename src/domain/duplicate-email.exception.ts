import {
    HttpException,
    HttpStatus,
} from "@nestjs/common";

export class DuplicateEmailException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.CONFLICT);
        this.name = "DuplicateEmailException";
    }
}
