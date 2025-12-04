import { Email } from '@/domain/shared/email';

/**
 * 이메일을 발송한다
 */
export interface EmailSender {
  send(email: Email, subject: string, body: string): void;
}
