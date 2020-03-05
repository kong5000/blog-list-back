const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')

const blogsRouter = require('./controllers/blog')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const commentsRouter = require('./controllers/comments')

//MONGODB_URI is from an environment variable. Using dotenv library config.js
//exposes the variables in the .env file in the root folder.
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

console.log(config.MONGODB_URI)

app.use(cors())
app.use(bodyParser.json())
//Instead of doing app.get('/api/blog... use a router to seperate code.
app.use(blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(commentsRouter)

//Allow cypress E2E test to make a POST to reset the test database if in test mode
if(process.env.NODE_ENV ==='test'){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

module.exports = app