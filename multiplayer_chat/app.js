const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, function () {
  console.log(`Server listening at port ${port}`);
});

// Routing
app.use(express.static(__dirname));

//WebChat
var numUsers = 0;
io.on('connection',function(socket){
	eventHandlers(socket);
});

function eventHandlers(socket){
	var isUser = false;//默认不是用户
	socket.on('new message', function(data) {
		var htmldata = html_encode(data);
		socket.broadcast.emit('new message', {
			username: socket.username,
			message:htmldata
		});
	});

	socket.on('add user', function(username) {
		if(isUser) return;
		socket.username = username;
		++numUsers;
		isUser = true;
		socket.emit('login',{
			numUsers:numUsers
		});
		socket.broadcast.emit('user joined', {
			username: socket.username,
			numUsers: numUsers
		});
		console.log('user joined '+username);
	});

	socket.on('typing', function(){
		socket.broadcast.emit('typing', {
			username:socket.username
		});
	});

	socket.on('stop typing', function(){
		socket.broadcast.emit('stop typing', {
			username:socket.username
		});
	});

	socket.on('disconnect', function(){
		if(isUser) {
			--numUsers;
			socket.broadcast.emit('user left', {
				username:socket.username,
				numUsers:numUsers
			})
		}
	});
}

function html_encode(str)   
{   
  var s = "";   
  if (str.length == 0) return "";   
  s = str.replace(/&/g, "&gt;");   
  s = s.replace(/</g, "&lt;");   
  s = s.replace(/>/g, "&gt;");   
  // s = s.replace(/ /g, "&nbsp;");   
  s = s.replace(/\'/g, "&#39;");   
  s = s.replace(/\"/g, "&quot;");   
  s = s.replace(/\n/g, "<br>");   
  return s;   
}