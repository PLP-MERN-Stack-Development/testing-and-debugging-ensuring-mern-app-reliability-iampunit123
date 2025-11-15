const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server'); // Changed from app.js to server.js

let mongoServer;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Posts API Integration Tests', () => {
  it('should get all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should get a post by ID', async () => {
    const res = await request(app).get('/api/posts/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title');
  });

  it('should create a new post', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
    };

    const res = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newPost.title);
  });

  it('should update a post', async () => {
    const updates = {
      title: 'Updated Post',
      content: 'Updated content',
    };

    const res = await request(app)
      .put('/api/posts/1')
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
  });

  it('should delete a post', async () => {
    const res = await request(app).delete('/api/posts/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Post deleted');
  });

  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});