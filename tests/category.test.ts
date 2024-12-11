import request from 'supertest';
import {app} from "../src";
import mongoose from 'mongoose';
import { Category } from '../src/models/Category';

describe('Category CRUD Operations', () => {

  beforeAll(async () => {
    await Category.deleteMany({});
    await mongoose.connect(process.env.MONGO_URI || '', { 
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category' })
        .expect(201);

      expect(response.body.data.name).toBe('Test Category');
    });

    it('should return an error if category name is duplicated', async () => {
      const categoryData = { name: 'Kesehatan' };
    
      // Membuat kategori pertama
      await request(app)
        .post('/api/categories')
        .send(categoryData);
    
      // Mencoba membuat kategori dengan nama yang sama
      const response = await request(app)
        .post('/api/categories')
        .send(categoryData);
    
      expect(response.status).toBe(400); // Harus 400 Bad Request
      expect(response.body.message).toBe('name must be unique'); // Periksa apakah message yang tepat ada
    });
    
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app).get('/api/categories').expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return a category by ID', async () => {
      const newCategory = await Category.create({ name: 'Specific Category' });
      const response = await request(app)
        .get(`/api/categories/${newCategory._id}`)
        .expect(200);

      expect(response.body.data.name).toBe('Specific Category');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category name', async () => {
      const newCategory = await Category.create({ name: 'Old Name' });
      const response = await request(app)
        .put(`/api/categories/${newCategory._id}`)
        .send({ name: 'New Name' })
        .expect(200);

      expect(response.body.data.name).toBe('New Name');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category by ID', async () => {
      const newCategory = await Category.create({ name: 'Delete Me' });
      const response = await request(app)
        .delete(`/api/categories/${newCategory._id}`)
        .expect(200);

      expect(response.body.message).toBe('Category successfully deleted');
    });
  });
});
