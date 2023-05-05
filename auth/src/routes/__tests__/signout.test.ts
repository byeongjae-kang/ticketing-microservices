import request from 'supertest';
import { app } from '../../app';
import { SIGNUP_URL } from './signup.test';
import { SIGNIN_URL } from './signin.test';

const SIGNOUT_URL = '/api/users/signout';

describe('signout', () => {
  beforeEach(async () => {
    await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);

    const res = await request(app)
      .post(SIGNIN_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('returns 200 and clear cookie on successful signout', async () => {
    const res = await request(app).post(SIGNOUT_URL).expect(200);
    expect(res.get('Set-Cookie')).toEqual([
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    ]);
  });
});
