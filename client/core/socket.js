function Socketer() {

	socket.on('ClientStart', function (data) { if (!START) {
		if (resources.isReady()) BuildGui();
    	else resources.onReady(BuildGui);
   		START = true;
    	UpdateMarkers("all");
	} else { 
		GUI.menu.Reset(); GUI.Draw(); } 
	})

	socket.on('Remote', function (action) { switch(action) {
		case "clearlogin" : ClearLogin(); break;
		default : console.log("invalid remotte instruction received"); break;
	}})

	socket.on('LoadData', function (type,data) { switch(type) {
		case "player" : player_data = data; break;
		default : console.log("invalid Data received"); break;
	}})

	//Sringifier log
	socket.on('Open', function (data) {
		console.log(JSON.stringify(data,null,4));
	})

	socket.on('ClientLog', function (message) {
		console.log(message);
	})

	socket.on('LoadFail', function () {
		alert("We are sorry your last query failed.\nPlease repeat the last command.\nIf the error persist please contact the support.");
	})
}

//Client Calls
function ReportErrorToServer(message) {
	socket.emit('ClientError', message);
}

function StartBuild(base,build,amount) { if(AntiSpam()) {
	console.log(base,build,amount);
	socket.emit('Build', base, build, amount);
}}

var lastquerytime = 0;
function AntiSpam() {
	Now();
	if (NOW>lastquerytime+1) {
		lastquerytime = NOW;
		return true;
	}
	else
		alert("Anti-Spam have been trigerred ! \nPlease be cool with the server :)");
	return false;
}