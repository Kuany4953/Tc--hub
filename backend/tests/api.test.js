const request = require('supertest');
const app = require('../src/index');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth endpoints', () => {
  const user = { name: 'Test User', email: 'test@trincoll.edu', password: 'password123' };
  let token;

  test('POST /api/auth/register — creates user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    token = res.body.token;
  });

  test('POST /api/auth/register — rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/login — returns token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login — rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me — returns user with token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
  });

  test('GET /api/auth/me — rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Resource endpoints', () => {
  let token, resourceId;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Resource User', email: 'resource@trincoll.edu', password: 'pass1234' });
    token = res.body.token;
  });

  test('GET /api/resources — returns list', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.resources)).toBe(true);
  });

  test('POST /api/resources — creates resource when authenticated', async () => {
    const res = await request(app).post('/api/resources')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Tutoring', description: 'Math tutoring for all levels', category: 'tutoring', location: 'Library' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Tutoring');
    resourceId = res.body.id;
  });

  test('POST /api/resources — rejects unauthenticated', async () => {
    const res = await request(app).post('/api/resources').send({ title: 'x', description: 'y', category: 'tutoring' });
    expect(res.status).toBe(401);
  });

  test('GET /api/resources/:id — returns resource', async () => {
    const res = await request(app).get(`/api/resources/${resourceId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(resourceId);
  });

  test('GET /api/resources — filters by category', async () => {
    const res = await request(app).get('/api/resources?category=tutoring');
    expect(res.status).toBe(200);
    res.body.resources.forEach(r => expect(r.category).toBe('tutoring'));
  });

  test('DELETE /api/resources/:id — deletes own resource', async () => {
    const res = await request(app).delete(`/api/resources/${resourceId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
