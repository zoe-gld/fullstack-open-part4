var lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const blog = blogs.find(blog =>
    blog.likes === Math.max(...blogs.map(blog => blog.likes))
  )
  return blog
    ? { 'title': blog.title, 'author': blog.author, 'likes': blog.likes }
    : 'There is no favorite blog'
}

const mostBlogs = (blogs) => {
  if (lodash.isEmpty(blogs)) {
    return 'There are no blogs in your list'
  }
  const authors = lodash.groupBy(blogs, 'author')
  return Object.values(authors).reduce((acc, val, index) => {
    if (val.length > acc['blogs']) {
      acc['author'] = Object.keys(authors)[index]
      acc['blogs'] = val.length
    }
    return acc
  }, { 'blogs': 0 })
}

const mostLikes = (blogs) => {
  if (lodash.isEmpty(blogs)) {
    return 'There are no blogs in your list'
  }
  const authors = lodash.groupBy(blogs, 'author')
  return Object.values(authors).reduce((acc, val, index) => {
    const totalLikes = val.reduce((likes, blog) => likes + blog.likes, 0)
    if (totalLikes > acc['likes']) {
      acc['author'] = Object.keys(authors)[index]
      acc['likes'] = totalLikes
    }
    return acc
  }, { 'likes': 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
