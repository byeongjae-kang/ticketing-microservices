import request from 'supertest';
import { app } from '../../app';
import { SIGNUP_URL } from './signup.test';

export const SIGNIN_URL = '/api/users/signin';

describe('signin', () => {
  beforeEach(async () => {
    await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);
  });

  it('returns 200 and cookie on successful signin', async () => {
    const res = await request(app)
      .post(SIGNIN_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('returns 400 with an invalid email', async () => {
    await request(app)
      .post(SIGNIN_URL)
      .send({ email: 'invalid', password: '1234' })
      .expect(400);
  });

  it('returns 400 with an invalid password', async () => {
    await request(app)
      .post(SIGNIN_URL)
      .send({ email: 'test@test.com', password: '' })
      .expect(400);
  });
});
