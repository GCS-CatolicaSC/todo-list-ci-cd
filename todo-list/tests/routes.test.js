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

  it('POST /tasks/:id/update deve atualizar o texto da tarefa', async () => {
    if (!createdTaskId) return;
    const res = await request(app)
      .post(`/tasks/${createdTaskId}/update`)
      .send('text=Tarefa%20Atualizada')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect([200, 302]).toContain(res.statusCode);

    const listRes = await request(app).get('/');
    expect(listRes.text).toContain('Tarefa Atualizada');
  });

  it('POST /tasks/:id/toggle deve alternar o estado da tarefa', async () => {
    if (!createdTaskId) return;
    const res = await request(app)
      .post(`/tasks/${createdTaskId}/toggle`)
      .send()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect([200, 302]).toContain(res.statusCode);
  });

  it('POST /tasks/:id/delete deve remover a tarefa', async () => {
    if (!createdTaskId) return;
    const res = await request(app)
      .post(`/tasks/${createdTaskId}/delete`)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect([200, 302]).toContain(res.statusCode);

    const listRes = await request(app).get('/');
    expect(listRes.text).not.toContain('Tarefa Atualizada');
  });

  it('POST /tasks/:id/update inexistente deve retornar 404', async () => {
    const res = await request(app)
      .post(`/tasks/999999/update`)
      .send('text=Qualquer')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(res.statusCode).toBe(404);
  });

  it('POST /tasks/:id/delete inexistente deve retornar 404', async () => {
    const res = await request(app)
      .post(`/tasks/999999/delete`)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(res.statusCode).toBe(404);
  });
});
