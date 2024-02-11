const { Server } = require('socket.io')

const io = new Server({cors: {
    origin: 'https://chatwiner.netlify.app/',
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"]
}});

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('message', (data) => {
        socket.broadcast.emit('received', {data: data, 'message' : 'Message sent to server.'});  //this code sending data from server to client
    })
})

io.listen(3000);