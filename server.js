// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
// this is a new line we're adding AFTER our server listener
// take special note how we're passing the server
// variable. unless we have the server variable, this line will not work!!
var io       = require('socket.io').listen(server);
var user     = {},
    messages = [{name: '', message: ''}];
    name_messages = [{user_name: '', user_message: ''}]

io.sockets.on('connection', function(socket) {
    console.log(socket.id, 'connected');

    socket.on('join', function(name) {
        if (name && name.length > 0) {
            user[socket.id] = name;

            var message = {name: '', message: user[socket.id]+' has joined'};
            messages.push(message);

            io.emit('user', user);
            io.emit('message_received', messages);
        } else {
            socket.emit('nameFail');
        }
    })
    socket.on('message_send', function(message) {
        var eachMessage = {name: user[socket.id], message: message};
        name_messages.push(eachMessage);

        io.emit('message_receive_user', name_messages);
    })

    socket.on('disconnect', function() {
        console.log(socket.id, 'disconnected');

        var message = {name: '', message: user[socket.id]+' has left the room'};
        messages.push(message);
        delete user[socket.id];
        io.emit('user', user);
        io.emit('message_received', messages);
    })
})
