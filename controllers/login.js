const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body
    
    //Search if user is in the database
    const user = await User.findOne({username: body.username})
 
    //bcrypt calculates hash from password and compares to the hash in db
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

    if(!user){
        return response.status(401).json({
            error: 'invalid username'
        })
    } else if(!passwordCorrect){
        return response.status(401).json({
            error: 'invalid password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }
    //Create a token that contains the username and id
    //Signed with a secret value in the .env file.
    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({token, username: user.username, name: user.name})

})

module.exports = loginRouter