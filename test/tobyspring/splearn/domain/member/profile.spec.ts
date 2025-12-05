import { Profile } from '@/domain/member/profile';

describe('ProfileTest', () => {
  it('profile', () => {
    new Profile('dongmin');
    new Profile('dongmin100');
    new Profile('12345');
    new Profile('');
  });

  it('profileFail', () => {
    expect(() => new Profile('asfdasdfasdfasdfasdfasdfasdfasdf')).toThrow();
    expect(() => new Profile('A')).toThrow();
    expect(() => new Profile('프로필')).toThrow();
  });

  it('url', () => {
    const profile = new Profile('dongmin');

    expect(profile.url()).toEqual('@dongmin');
  });
});
