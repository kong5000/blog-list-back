const listHelper = require('../utils/list_helper')
//supertest helps test APIs
const supertest = require('supertest')
//The actual express app
const app = require('../app')
//The express app wrapped into a superagent object
const api = supertest(app)

const Blog = require('../models/blog')

/*  Running with npm test will use the test database instead of the real one,
    the script sets the NODE_ENV variable to test, config.js then provides the
    test database instead.
*/

const initialBlogs = [
    {
        title: "BLOG_TITLE A",
        author: "AUTHOR A",
        url: "www.string.com",
        likes: 1,
        user: "user A"
    },
    {
        title: "BLOG_TITLE B",
        author: "AUTHOR B",
        url: "www.string.com",
        likes: 2,
        user: "user B"
    },
    {
        title: "BLOG_TITLE C",
        author: "AUTHOR C",
        url: "www.string.com",
        likes: 3,
        user: "user C"
    }
]

beforeEach(async () => {
    //Clear the test database
    await Blog.deleteMany({})
    // Turn the array of objects into mongo documents
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    //Make an array of promises, one for each blog.save()
    const promiseArray = blogObjects.map(blog => blog.save())
    //Await for all promises to resolve with Promise.all
    await Promise.all(promiseArray)
})

describe('Can read from the database', () => {
    test('Gets the correct number of blogs in the database', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(3)
    })
})

describe('Can delete from database', () => {
    test('Delete a post from the database', async () => {
        const blogsResponse = await api.get('/api/blogs')
        const blogs = blogsResponse.body
        const firstBlogId = blogs[0]._id

        await api.delete(`/api/blogs/${firstBlogId}`)
            .expect(204)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(2)

    })
})

describe('Modifying a blog in the database with a PUT request', () => {
    test('PUT reqeuest changes first blogs likes to 10', async () => {
        const blogsResponse = await api.get('/api/blogs')
        const blogs = blogsResponse.body
        const firstBlog = blogs[0]
        const firstBlogId = firstBlog._id
        firstBlog.likes = 10
        await api
            .put(`/api/blogs/${firstBlogId}`)
            .send(firstBlog)

        const response = await api.get(`/api/blogs/${firstBlogId}`)
        const updatedBlog = response.body;
        expect(updatedBlog.likes).toBe(10)

    })
})

describe('Can post blogs to the database', () => {
    test('Post one blog to the database', async () => {
        const newBlog = {
            title: "test post title",
            author: "AUTHOR",
            url: "www.string.com",
            likes: 3,
            user: "user"
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)
        expect(titles).toContain('test post title');
    })
})


describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    const listWithThreeBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 1,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 2,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 3,
            __v: 0
        }
    ]

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })


    test('when list has 3 blogs equals the total likes of those 3', () => {
        const result = listHelper.totalLikes(listWithThreeBlogs)
        expect(result).toBe(6)
    })
})