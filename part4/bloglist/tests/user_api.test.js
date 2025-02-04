const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('fails with a 400 status code if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'DuplicateUser',
      password: 'testpassword'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    assert(result.body.error.includes('expected `username` to be unique'))
  })

  test('fails with a 400 status code if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'ab',
      name: 'ShortUsername',
      password: 'testpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with a 400 status code if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'username',
      name: 'ShortPassword',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    assert(result.body.error.includes('password must be at least 3 characters long'))
  })

  test('fails with a 400 status code if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testusername',
      name: 'MissingPassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    assert(result.body.error.includes('password missing'))
  })

  test('fails with a 400 status code if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'MissingUsername',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})