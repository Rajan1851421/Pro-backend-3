const http = require('http')
const cors = require('cors')
const app = require('./aap')
const server = http.createServer(app)
const port = process.env.PORT || 3000

server.use(cors());

server.listen(port,()=>{
    console.log('App is Running on localhost:'+port)
})


