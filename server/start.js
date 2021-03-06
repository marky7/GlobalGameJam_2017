var express = require('express');
var favicon = require('serve-favicon');

var app   = express();
  app.use(express.static(__dirname+'/client/'));
  app.use(favicon(__dirname + '/client/img/favicon.ico'));
  app.set('views', __dirname + '/client/');
  app.set('view engine', 'ejs');

var server  = require('http').Server(app);
var io    = require('socket.io')(server);

var log_stdout = process.stdout;
console.log = function(d) { //
  log_stdout.write(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')+" "+ d + '\n');
};

//HOMEPAGE
app.get("/",function(req,res){//-
  console.log("New connexion from IP : "+req.connection.remoteAddress);
  res.render('client.ejs');
  //handle_database(req,res,0);
});
