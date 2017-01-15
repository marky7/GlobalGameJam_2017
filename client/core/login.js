//LOGIN
var loginmode = 1;
function LoginAuto() {
	if (loginmode == 1) MainLogin();
	if (loginmode == 2) MainRegis();
}

function MainLogin() {
	var name = document.getElementById('user').value;
	var pwrd = document.getElementById('pwrd').value;
	if (name!="" && pwrd!="" && AntiSpam())
		socket.emit('Login', name , pwrd);
}
function MainRegis() {
	var name = document.getElementById('name').value;
	var pwd1 = document.getElementById('pwd1').value;
	var pwd2 = document.getElementById('pwd2').value;
	var eml1 = document.getElementById('eml1').value;
	var eml2 = document.getElementById('eml2').value;
	if (name!="" && pwd1!="" && eml1!="" && pwd1 == pwd2 && eml1 == eml2 && AntiSpam())
		socket.emit('Register', name , pwd1 , eml1);
}
function ClearLogin() {
	document.getElementById('user').value = "";
	document.getElementById('pwrd').value = "";
}

function OpenLogin() {
	document.getElementById("login").style.visibility = "visible";
	document.getElementById("regis").style.visibility = "hidden";
	loginmode = 1;
}
function OpenRegis() {
	document.getElementById("login").style.visibility = "hidden";
	document.getElementById("regis").style.visibility = "visible";
	loginmode = 2;
}