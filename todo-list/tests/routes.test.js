const request = require('supertest');
const app = require('../app');

describe('Testes de Integração da Aplicação de Tarefas', () => {
  let createdTaskId;

  it('GET / deve responder com status 200 e renderizar HTML', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  it('POST /tasks deve criar uma nova tarefa e redirecionar', async () => {
    const res = await request(app)
      .post('/tasks')
      .send('text=Tarefa%20de%20Teste')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/');

    const listRes = await request(app).get('/?filter=all');
    expect(listRes.statusCode).toBe(200);
    expect(listRes.text).toContain('Tarefa de Teste');

    const match = listRes.text.match(/\/tasks\/(\d+)\/toggle/);
    if (match) createdTaskId = match[1];
  });

  it('POST /tasks/:id/toggle deve alternar o estado da tarefa', async () => {
    if (!createdTaskId) return;
    const res = await request(app)
      .post(`/tasks/${createdTaskId}/toggle`)
      .send()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect([200, 302]).toContain(res.statusCode);
  });

  it('DELETE /tasks/:id deve remover a tarefa', async () => {
    if (!createdTaskId) return;
    const res = await request(app)
      .post(`/tasks/${createdTaskId}?_method=DELETE`)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect([200, 302]).toContain(res.statusCode);

    const listRes = await request(app).get('/');
    expect(listRes.text).not.toContain('Tarefa de Teste');
  });
});
