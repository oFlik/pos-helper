const index = require('../routes/indexRoutes')
const user = require('../routes/userRoutes')

module.exports = (app) => {
  app.use(index)
  app.use('/user', user)
}
