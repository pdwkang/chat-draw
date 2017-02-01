// THIS IS CALLED BY INDEX.HTML  >>>  CLIENT SIDE JS FILE
// console.log($) -> console.log(io)     same concept

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!! WEBSOCKET SECTION !!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// var socketio = io.connect('http://127.0.0.1:8080');
var socketio = io.connect('http://35.165.99.192:8080');
// var socketio = io.connect('http://10.150.51.64:8080');

//once we have this connection(above) we get this whole document(index.html): only way to get this to the browser
socketio.on('users', (socketUsers) =>{
	// console.log(socketUsers)
	var newHTML = "";
	socketUsers.map((currSocket, index) => {
		newHTML += '<li class="user">' + currSocket.socketID + '</li>';
	})
	document.getElementById('userNames').innerHTML = newHTML;
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!! Client Functions !!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function sendChatMessage(){
	event.preventDefault();
	var messageToSend = document.getElementById('chat-message').value;
	socketio.emit('messageToServer', {
		// messageObject
		message: messageToSend,
		name: "Anonymous"
	})
};

socketio.on('messageToClient', (messageObject) => {
	document.getElementById('userChats').innerHTML += '<div class="message">' + messageObject.message + '__' + messageObject.date + '</div>'
});


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!! CANVAS !!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Set up base options
var color = "#000";
var thickness = 10;
var mouseDown = false;
var mousePosition = {};
var lastMousePosition = null;
var colorPick = document.getElementById('color-picker')
var thicknessPicker = document.getElementById('thickness')

colorPick.addEventListener('change', (event)=>{
	color = colorPick.value;
});
thicknessPicker.addEventListener('change',(event)=>{
	thickness = thicknessPicker.value;
})
canvas.addEventListener('mousedown', (event)=>{
	mouseDown = true;

})

canvas.addEventListener('mouseup', (event)=>{
	mouseDown = false;
	lastMousePosition = null;

})

canvas.addEventListener('mousemove', (event)=>{
	if(mouseDown){
		// mouse must be down because we update this boolean in mousedown/mouseup
		var magicBrushX = event.pageX - canvas.offsetLeft;
		var magicBrushY = event.pageY - canvas.offsetTop;
		mousePosition ={
			x: magicBrushX,
			y: magicBrushY
		}
		if(lastMousePosition !== null){
			// console.log(mousePosition)
			context.strokeStyle = color;
			context.lineJoin = 'round';
			context.lineWidth = thickness;
			context.beginPath();
			context.moveTo(lastMousePosition.x, lastMousePosition.y);
			context.lineTo(mousePosition.x, mousePosition.y);
			context.stroke();
			context.closePath();
		}

		// update lastMousePosition

		var drawingDataForServer = {
			mousePosition: mousePosition,
			lastMousePosition: lastMousePosition,
			color: color,
			thickness: thickness
		}
		lastMousePosition = {
			x: mousePosition.x,
			y: mousePosition.y
		}				
		socketio.emit('drawingToServer', drawingDataForServer);


		socketio.on('drawingToClients', (drawingData)=>{
			context.strokeStyle = drawingData.color;
			context.lineJoin = 'round';
			context.lineWidth = drawingData.thickness;
			context.beginPath();
			context.moveTo(drawingData.lastMousePosition.x, drawingData.lastMousePosition.y);
			context.lineTo(drawingData.mousePosition.x, drawingData.mousePosition.y);
			context.stroke();
			context.closePath();			
		});
	};
});

