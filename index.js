const http = require('http')
const app = require('./src/app')

const normalizePort = require('normalize-port')

const port = normalizePort(process.env.PORT || 3001)
app.set('port ', port)
const server = http.createServer(app)

server.listen(port)
console.log(`API rodando na porta ${port}`)
