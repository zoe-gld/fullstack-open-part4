const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const blogsList = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}, {
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}, {
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
}, {
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0
}, {
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
}, {
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}]


describe('total likes', () => {

  test('when list empty, equals 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([blogsList[0]])
    expect(result).toBe(7)
  })

  test('when list has many blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(blogsList)
    expect(result).toBe(36)
  })
})


describe('favorite blog', () => {

  test('when list empty, returns a string sayinng there is no favorite', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe('There is no favorite blog')
  })

  test('when list has only one blog, returns its attributes', () => {
    const result = listHelper.favoriteBlog([blogsList[0]])
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('when list has many blogs, returns attributes of the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogsList)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

})

describe('most blogs', () => {

  test('when list empty, returns a string saying so', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe('There are no blogs in your list')
  })

  test('when list has only one blog, returns it', () => {
    const result = listHelper.mostBlogs([blogsList[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('when list has many blogs, returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogsList)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

})

describe('most likes', () => {

  test('when list empty, returns a string saying so', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe('There are no blogs in your list')
  })

  test('when list has only one blog, returns it', () => {
    const result = listHelper.mostLikes([blogsList[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('when list has many blogs, returns the author with most blogs', () => {
    const result = listHelper.mostLikes(blogsList)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

})

