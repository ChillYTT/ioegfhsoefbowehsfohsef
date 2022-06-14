const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/:room', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('*', (req, res) => {
	res.send('404 Not Found');
});

http.listen(3000, () => console.log('server started'));

io.engine.generateId = function (req) {
	return randHex(6);
};

io.on('connection', function (socket) {
	socket.on('join', function (data) {
		socket.proto = socket.proto || {};
		if (data && data !== '/') {
			socket.join(data.substr(1));
			socket.proto.room = data.substr(1);
		} else {
			socket.join('main');
			socket.proto.room = 'main';
			data = '/main';
		}
		socket.emit('message', { name: 'System', message: `you are now online!` });
		socket.emit('message', { name: 'TB (admin)', message: `Hi and welcome to Random chat here you can chat online bc why not. This site is supported by almost all devices! enjoy :)` });
	});
	socket.on('message', function (data) {
		let message = data.message.substr(0, 500);
		let name = socket.id;
		console.log(socket.proto.room);
		message = message.replace(/<.*>/g, '[html]');
		if (data.key) {
			if (data.key.split('-')[1] === process.env.ADMIN) {
				name = '@' + data.key.split('-')[2];
			}
		}
		if (message) {
			if (data.room && data.room !== '/') {
				io.to(data.room.substr(1)).emit('message', { name: name, message: message });
			} else {
				io.to('main').emit('message', { name: name, message: message });
			}
		}
	});
});

function randHex(len) {
	var letters = '0123456789abcdef';
	var color = '';
	for (var i = 0; i < len; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
