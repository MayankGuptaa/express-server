// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const PORT = 3000;
// const api = require('./routes/api')
// const app = express();

// app.use(cors())

// app.use(bodyParser.json())

// app.use('/api', api)
// app.get('/', (req, res) => {
//     res.send('Hello from server')
// });

// app.listen(PORT, () => {
//     console.log(`Server Running on localhost ${PORT}`)
// })

const cors = require('cors');
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {

    // Log whenever a server connects
    console.log('App Connected');

    socket.on('join', data => {
        //Join
        socket.join(data.room);
        console.log(`${data.user} joined the room: ${data.room}`);
        socket.broadcast.to(data.room).emit('new user joined', {user: data.user, message: 'Had joined the room'});
    });


    socket.on('leave', data => {
        console.log(`${data.user} Left the room: ${data.room}`);
        socket.broadcast.to(data.room).emit('left room', {user: data.user, message: 'Had left the room'});
        socket.leave(data.room);
    });

    socket.on('message', data => {
        io.in(data.room).emit('New Message', {user: data.user, message:data.message});
    });


});

// Initialize our websocket server on port 3000
http.listen(3000, () => {
    console.log('started on port 3000');
});