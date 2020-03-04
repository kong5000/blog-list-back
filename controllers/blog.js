//using express.Router to create a modular route handler, a "mini app"
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

/*The authorization is of the form bearer tokenStringHere
  this function will return just the token without 'bearer '*/
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        //Substring(7) cuts the first 7 characters and leaves the rest
        return authorization.substring(7)
    }
    return null
}


blogsRouter.get('/api/blogs', async (request, response) => {
    // populate the user property which was originally just contained a user id,
    // now the user property is the actual user.
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(b => b.toJSON()))

})


blogsRouter.get('/api/blogs/:id', (request, response) => {
    Blog
        .findById(request.params.id)
        .then(blog => {
            response.json(blog)
        })
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
 
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if(!token || !decodedToken.id){
            return response.status(401).json({error: 'token missing or invalid'})
        }

        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
            title: body.title,
            author: body.author,
            user: user._id,
            url: body.url,
            likes: body.likes
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog.toJSON())
    } catch(exception){
        next(exception)
    }
})

blogsRouter.delete('/api/blogs/:id', (request, response) => {
    Blog.findByIdAndRemove(request.params.id).then(
        response.status(204).end()
    )
})

blogsRouter.put('/api/blogs/:id', (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog.toJSON())
        })

})

module.exports = blogsRouter