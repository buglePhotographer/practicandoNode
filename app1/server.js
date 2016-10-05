'use strict';
const PORT = 8080;

// App
var express = require('express');
var app = express();
var events = require('events');
var fs = require('fs');
var cookieParser = require('cookie-parser')

app.use(cookieParser());

// Event Emitter ---------------------------------------------------------
var eventEmitter = new events.EventEmitter();

var connectionHandler = function connected(){
	console.log("connection successful");

	eventEmitter.emit('data_received');
};



eventEmitter.on('connection', connectionHandler);

eventEmitter.on('data_received', function(){
	console.log("data received successfully");
});

eventEmitter.emit('connection');

//-------------------------------------------------------------------------


// Read file async --------------------------------------------------------
//var data = fs.readFile('data/data.txt', function(err, data){
//	if (err) 
//		return console.error(err.stack);
//	console.log(data.toString());
//});

//Another way of reading with streams (event emitters)
var readerStream = fs.createReadStream('data/anotherData.txt');
readerStream.setEncoding('UTF8');
var data = '';

readerStream.on('data', function(chunk){
	data += chunk;
});

readerStream.on('end', function(){
	console.log(data);
});

readerStream.on('error', function(err){
	console.log(err.stack);
});

//-------------------------------------------------------------------------

//Write stream

// Create a writable stream -----------------------------------------------
var writerStream = fs.createWriteStream('data/output.txt');
var data2 = "Writing on a file";
// Write the data to stream with encoding to be utf8
writerStream.write(data2,'UTF8');

// Mark the end of file
writerStream.end();

// Handle stream events --> finish, and error
writerStream.on('finish', function() {
    console.log("Write completed.");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});

//-------------------------------------------------------------------------

//Deleting previous file

fs.unlink('data/output.txt',function(err){
	if(err)
		return console.error(err.stack);
	console.log("File deleted successfully");
});

//-------------------------------------------------------------------------

console.log(__filename);
console.log(__dirname);


app.get('/', function (req, res) {
  //res.send('Hello world\n');
  console.log("Cookies: ", req.cookies)
});

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/data/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
});

app.get('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/data/" + "users.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      data["user4"] = user["user4"];
      console.log( data );
      res.end( JSON.stringify(data));
   });
});

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/data/" + "users.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      var user = data["user" + req.params.id] 
      console.log( user );
      res.end( JSON.stringify(user));
   });
});

app.get('/deleteUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/data/" + "users.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      delete data["user" + 2];
       
      console.log( data );
      res.end( JSON.stringify(data));
   });
});

var server = app.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Running on http://'+ host + ':' + port);
});