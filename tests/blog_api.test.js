const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray1 = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray1)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs have an id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'React patterns'
    )
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added by a logged in user', async () => {
    const userResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = userResponse.body.token

    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'First class tests'
    )
    expect(response.body.find(blog => blog.title === 'First class tests').likes).toEqual(10)
  })

  test('blog creation does not work without token', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    expect(postResponse.body.error).toEqual('invalid token')

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  // test('if the likes property is missing from the POST request, it defaults to the value 0', async () => {
  //   const newBlogWithoutLikes = {
  //     title: 'TDD harms architecture',
  //     author: 'Robert C. Martin',
  //     url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
  //   }

  //   const response = await api
  //     .post('/api/blogs')
  //     .send(newBlogWithoutLikes)

  //   expect(response.body.likes).toEqual(0)

  // })

  // test('returns 400 if title and url properties are missing from the request', async () => {
  //   const newBlogWithoutTitleNorUrl = {
  //     author: 'Robert C. Martin',
  //   }
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlogWithoutTitleNorUrl)
  //     .expect(400, 'blogs must have either a title or a url')
  // })
})

describe('DELETE /api/blogs/:id', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )
    expect(blogsAtEnd).toContainEqual(response.body)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
