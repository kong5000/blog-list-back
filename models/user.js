const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId, //Will be used later to populate with actual blogs
            ref: 'Blog'
        }
    ]
})

/* Can format objects returned by Mongoose by modifying the toJSON method of the objects.
  Modify like this:
*/
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v //dont need the mongo versioning field
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User