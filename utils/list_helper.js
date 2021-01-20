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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
