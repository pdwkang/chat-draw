// THIS IS THE SERVER 8080

// OUR NODE JS LIVES HERE. WE BUILT THE SERVER HERE


// include http and fs
var http = require('http');
var fs = require('fs');
var server = http.createServer((req, res) => {
	// console.log('Someone connected via HTTP')
	// fs.readFile('index.html', 'utf-8', (error, fileData) => {
	// 	if(error){
	// 		// respond with a 500 error!
	// 		res.writeHead(500, {'content-type' : 'text/html'});
	// 		res.end(error)
	// 	}else{
	// 		// the file was able to be read int
	// 		res.writeHead(200, {'content-type' : 'text/html'});
	// 		res.end(fileData)
	// 	}
	// })
});

// Include server version of socketIo assing it to a variable
var socketIo = require('socket.io');
// sockets are going to listen to the server which is listening on port 8080
// sockets are piggy backing on the server listener
var io = socketIo.listen(server);

// handle socket connections..
// ALL YOU NEED TO KNOW ABOUT SOCKETS IS io.sockets.on   AND io.sockets.emit!!!!!!!!!!!!!!
var socketUsers = [];
io.sockets.on(('connect'), (socket) => {
	console.log('Someone connected by socket!!!');
	socketUsers.push({
		socketID: socket.id,
		name: 'Anonymous'
	})
	io.sockets.emit('users', socketUsers);
	socket.on(('disconnect'), ()=>{
	})
	// console.log(this)
	var indexWithinArray = socketUsers.indexOf(this)
	// socketUsers.splice()
	console.log(indexWithinArray)
	socket.on('messageToServer', (messageObject)=>{
		// console.log('someone sent a message. it is', messageObject.message)
		io.sockets.emit('messageToClient', {
			message: messageObject.message, 
			date: new Date()
		})
	})
	socket.on('drawingToServer', (drawingData)=>{
		if(drawingData.lastMousePosition !== null){
			io.sockets.emit('drawingToClients', drawingData);
		}
	})
})

server.listen(8080)
console.log('Listening on port 8080...')
socketUsers.splice(0,3)