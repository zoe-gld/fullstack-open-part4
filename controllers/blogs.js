const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  blog.likes = request.body.likes || 0
  if (!blog.title && !blog.url) {
    return response.status(400).send('Bad Request')
  }
  const savedBlog = await blog.save()
  response.json(savedBlog)
})

module.exports = blogsRouter
