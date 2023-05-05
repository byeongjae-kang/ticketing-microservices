import request from 'supertest';
import { app } from '../../app';

export const SIGNUP_URL = '/api/users/signup';

describe('signup', () => {
  it('returns 200 and cookie on successful signup', async () => {
    const res = await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('returns 400 with an invalid email', async () => {
    await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'invalid', password: '1234' })
      .expect(400);
  });

  it('returns 400 with an invalid password', async () => {
    await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '' })
      .expect(400);
  });

  it('returns 400 on signup with existing email', async () => {
    await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);

    await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(400);
  });
});
