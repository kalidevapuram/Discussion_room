// Require the Express Module
var express = require("express");
// Create an Express App
var app = express();
// Require path
var path = require("path");
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
 res.render("index");
})

// tell your server which port to run on

var port_number = app.listen(process.env.PORT || 3000);

var io       = require('socket.io').listen(port_number);
var user     = {},
    messages = [{name: '', message: ''}];
    name_messages = [{user_name: '', user_message: ''}]

io.sockets.on('connection', function(socket) {

    socket.on('join', function(name) {
        if (name && name.length > 0) {
            user[socket.id] = name;

            var message = {name: '', message: user[socket.id]+' has joined'};
            messages.push(message);

            io.emit('user', user);
            io.emit('message_received', messages);
        } else {
            socket.emit('wrongname');
        }
    })
    socket.on('message_send', function(message) {
        var eachMessage = {name: user[socket.id], message: message};
        name_messages.push(eachMessage);

        io.emit('message_receive_user', name_messages);
    })

    socket.on('disconnect', function() {

        var message = {name: '', message: user[socket.id]+'left the room'};
        messages.push(message);
        delete user[socket.id];
        io.emit('user', user);
        io.emit('message_received', messages);
    })
})
