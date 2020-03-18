const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (request, response, next) => {
    try {
        const body = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            blogs: body.blogs,
            passwordHash //important that the actual password is not stored in database.
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('/api/users', async (request, response, next) => {
    const allUsers = await User.find({}).populate('blogs')
    const usersJson = allUsers.map(u => u.toJSON())
    response.json(usersJson);
})

usersRouter.delete('/api/users', (request, response) => {
    User.deleteMany({}).then(response.status(204).end())

})


module.exports = usersRouter