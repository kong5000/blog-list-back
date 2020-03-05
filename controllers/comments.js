const commentsRouter = require('express').Router()
const Blog = require('../models/blog')

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

commentsRouter.post('/api/blogs/:id/comments', async (request, response) => {
    const body = request.body
    const blog = await Blog.findById(request.params.id)
    console.log(blog)

    const blogWithNewComment = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user,
        comments: blog.comments.concat(body.comment)
    }


    Blog.findByIdAndUpdate(request.params.id, blogWithNewComment, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog.toJSON())
        })


})

module.exports = commentsRouter