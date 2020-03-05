const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const usersInDb = async () => {
    //To find all of a certain document type use the models .find method
    const users = await User.find({})
    return(users.map(u => u.toJSON()))
}


beforeEach(async () => {
    await User.deleteMany({})
})

test('Can create a single user', async () => {
    const testUser = {
        username: "keith",
        name: "Keith O",
        password: "mypassword"
    }

    await api.post('/api/users')
            .send(testUser)

   const users = await usersInDb()
   const usernames = users.map(u => u.username)
   expect(usernames).toContain(testUser.username)

})