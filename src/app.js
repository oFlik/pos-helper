const app = require('./config/basic')

require('./config/routes')(app)

module.exports = app
