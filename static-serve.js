// THIS IS THE STATIC SERVER 8081


// inlcude a static server to serve up our files
var connect = require('connect');
var serveStatic = require('serve-static')
connect().use(serveStatic(__dirname)).listen(8081,()=>{
	console.log('Static server is running on 8081..')
})
