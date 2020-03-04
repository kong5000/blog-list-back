//Install the dotenv library, instead of using PORT=3003 npm run watch to set
//the environment variable. With dotenve put the variables in a .env file
require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if(process.env.NODE_ENV === 'test'){
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}