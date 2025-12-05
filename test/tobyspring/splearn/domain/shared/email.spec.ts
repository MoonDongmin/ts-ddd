import { Email } from '@/domain/shared/email';

describe('EmailTest', () => {
  it('equality', () => {
    const email1: Email = new Email('cook1008@gmail.com');
    const email2: Email = new Email('cook1008@gmail.com');

    expect(email1).toEqual(email2);
  });
});
