const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

/* Allows cypress e2e test to send a POST request that resets the test database
*/

testingRouter.post('/reset', async (request, response) => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    response.status(204).end()
})

module.exports = testingRouter