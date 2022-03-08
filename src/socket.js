const mic = require('mic'); 

const net = require('net')
const server = net.createServer()

const host = "10.0.0.186"
const port = 3000


let sockets = []

let isStreaming = false; 
let quietFrame = 20; 

let header; 

let dataCount = 0; 

const micInstance = mic({
	rate:16000,
	channels:'1',
	exitOnSilence:10,
	device:"hw:2,0",
	fileType:'wav'
})


const removeSocket=(clientAddress)=>{
	let index = sockets.find(s=>{
		return s.remoteAddress === clientAddress.split(':')[0]  && s.remotePort === clientAddress.split(':')[1]
	})
	if(index !== -1){
		console.log(`user: ${clientAddress}  disconnected`)
		sockets.splice(index,1);
		if(sockets.length === 0) micInstance.pause();
	}
}

const writeAll = (data) =>{
	sockets.forEach(socket=>{
		socket.write(data); 
	})
}

const micInput = micInstance.getAudioStream()
micInput.on('quiet',()=>{
	// add on to the quite frame counter
	// after n silent frames close the stream and send a endfile message 
	quietFrame++;
	console.log('quite frame'); 
	if(quietFrame == 20) {
		isStreaming=false;
		writeAll('endFile')
	}
})

micInput.on('speech',()=>{
	// start piping the mic data
	if(!isStreaming) {
		writeAll('startFile');
		writeAll(header); 
	}
		console.log('speech frame'); 
	isStreaming = true;
	quietFrame = 0; 
})


micInput.on('data',(data)=>{
	if(dataCount <= 0){
		dataCount++; 
		console.log('saving header'); 
		header = data;
		micInstance.pause();
	}
	if(isStreaming){
		writeAll(data); 
	}
})

micInput.on('error',(data)=>{
	console.log(data);
})

server.listen(port,host,()=>{
	console.log(`server listening at ${host}:${port}`);
})


server.on('connection',(socket)=>{
	micInstance.resume();
	let clientAddress = `${socket.remoteAddress}:${socket.remotePort}`
	console.log(`a new user connected: ${clientAddress}`)
	sockets.push(socket);
	console.log('writing start file'); 
	socket.write('startFile'); 
	console.log('writing header: ',header); 
	socket.write(header); 
	socket.on('data',(data)=>{
		console.log('data recieved: ',data)
	})
	socket.on('close',(data)=>{
		removeSocket(clientAddress); 
	})
	
	socket.on('error',(err)=>{
		console.log(`an error occured in ${clientAddress}, err: ${err}`)
	})
	
})
micInstance.start()


module.exports = server; 