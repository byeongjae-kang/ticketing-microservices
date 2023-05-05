import request from 'supertest';
import { app } from '../../app';
import { SIGNUP_URL } from './signup.test';

const CURRENT_USER_URL = '/api/users/currentuser';

describe('currentuser', () => {
  it('returns 200 and user if exists', async () => {
    const signupResponse = await request(app)
      .post(SIGNUP_URL)
      .send({ email: 'test@test.com', password: '1234' })
      .expect(200);

    const cookie = signupResponse.get('Set-Cookie');

    const res = await request(app)
      .get(CURRENT_USER_URL)
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body.currentUser.email).toEqual('test@test.com');
  });

  it('returns 200 with null if not exists', async () => {
    const res = await request(app).get(CURRENT_USER_URL).expect(200);

    expect(res.body.currentUser).toBeNull();
  });
});
