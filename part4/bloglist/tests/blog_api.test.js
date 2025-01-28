const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => assert(blog.id))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'this is a title',
    author: 'author',
    url: 'https://example.com/new-blog',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('this is a title'))
})

test('defaults likes to 0 if likes property is missing', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Test Author',
    url: 'https://example.com/blog-without-likes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const savedBlog = blogsAtEnd.find((blog) => blog.id === response.body.id)
  assert.strictEqual(savedBlog.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
