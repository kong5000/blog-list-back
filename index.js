const app = require('./app')
const config = require('./utils/config')

const PORT = process.env.PORT || config.PORT
console.log(process.env.PORT)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})