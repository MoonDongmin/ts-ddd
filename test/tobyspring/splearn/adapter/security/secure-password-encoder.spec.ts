import { SecurePasswordEncoder } from '@/adapter/security/secure-password-encoder';

describe('SecurePasswordEncoderTest', () => {
  it('securePasswordEncoder', () => {
    const securePasswordEncoder: SecurePasswordEncoder =
      new SecurePasswordEncoder();

    const passwordHash: string = securePasswordEncoder.encode('secret');

    expect(securePasswordEncoder.matches('secret', passwordHash)).toBeTruthy();
    expect(securePasswordEncoder.matches('wrong', passwordHash)).toBeFalsy();
  });
});
