const request = require('supertest');
const app = require('../app'); // Seu arquivo Express principal

describe('GET /', () => {
  it('Deve responder com status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
