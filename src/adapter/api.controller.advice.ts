import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
}                                  from "@nestjs/common";
import {HttpArgumentsHost}         from "@nestjs/common/interfaces";
import {Response}                  from "express";
import {DuplicateEmailException}   from "@/domain/member/duplicate-email.exception";
import {DuplicateProfileException} from "@/domain/member/duplicate-profile.exception";

interface ProblemDetail {
  status: number;
  detail: string;
  timestamp: string;
  exception: string;
}

@Catch()
export class ApiControllerAdvice implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    let status: HttpStatus;
    let message: string;

    if (
      exception instanceof DuplicateEmailException ||
      exception instanceof DuplicateProfileException
    ) {
      // DuplicateEmailException과 DuplicateProfileException은 CONFLICT(409) 처리
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      // 기타 HttpException은 해당 상태 코드 사용
      status = exception.getStatus();
      message = exception.message;
    } else {
      // 알 수 없는 예외는 INTERNAL_SERVER_ERROR(500) 처리
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        exception instanceof Error
          ? exception.message
          : "Internal server error";
    }

    const problemDetail: ProblemDetail = {
      status,
      detail: message,
      timestamp: new Date().toISOString(),
      exception:
        exception instanceof Error
          ? exception.constructor.name
          : "UnknownException",
    };

    response.status(status).json(problemDetail);
  }
}
