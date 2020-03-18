const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    url: String,
    likes: Number,
    comments: [String],
    date: String
  })
  
//Blog is a 'model', a special kind of constructor. Instances of a model are
//called documents. document.save() saves to the mongoDB
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog