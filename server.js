const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

const port = 8000;

//Клієнстька частина сайту знаходиться у папці public
app.use(express.static(__dirname + "/public"));

//Стандарти кодування
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	'extended': 'true'
}));


var messages = [];
var connections = [];
var users = [{
	login: "admin",
	password: "123"
}];


io.sockets.on("connection", function (socket) {
	console.log('user connected');

	//Chat's functions
	connections.push(socket);

	socket.on("sendMessage", function (data) {
		messages.push(data);
		connections.forEach(function (client) {
			client.emit("message", data)
		});

	})

	// Login form functions 
	socket.on("sendSignIn", function (data) {

		for (let i = 0; i < users.length; i++) {
			if (data.login == users[i].login) {
				if (data.password == users[i].password) {
					socket.emit("userStatus", "Welcome admin!");
					return;
				} else {
					socket.emit("userStatus", "Wrong password!");
					return;
				}
			}
		}
		socket.emit("userStatus", "Wrong login!");

	})

});



// Усі адреси контро
app.get("*", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});


server.listen(port, function (err) {
	if (err) throw err;
	console.log("Server start port 8000!");
});
