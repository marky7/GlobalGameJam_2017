
console.log("╔════════════════════╗");
console.log("║ GGJ SERVER STARTED ║");
console.log("╚══╦══════════════╦══╝");
console.log("   ╚═══ V0.0.1 ═══╝   ");
console.log("Timestamp : "+Math.round(Date.now() / 1000) );
//(1337, "127.0.0.1"); //(80) on serv
//app.listen(80); 
server.listen(8080, function(){
	console.log('listening on port : 8080');
});
