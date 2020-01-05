//MOUSE MANAGEMENT
var mouse = {
	x: 0, y: 0,		// 3D position // Computed for raycast // from bottom left to top right // Range : [-1,1]
	xp: 0, yp: 0,	// 2D position // Obtained from mouse  // from top left to bottom right // Range : [0,screen.width/height] 
	xd: 0, yd: 0,	// 2D differential on mouse mouve
	xs: 0, ys: 0,	// 2D position saved on mouse mouve//down (usefull when dragging)
	t:false, 		// Mouse state trigger// set true at mouse down // reset false at first interception
	c:false, 		// Mouse state click  // set true at mouse up   // reset false at first interception
	d:false, 		// Mouse state drag   // set 'name' at interception // reset false at mouse up
};

document.addEventListener( 'mousemove', PointerMove, false );
document.addEventListener( 'mousedown', PointerClick, false );
document.addEventListener( 'mouseup', PointerRelease, false );
document.addEventListener('keydown', event => {
	switch (event.keyCode) {
		case 17: // Ctrl
            MovingScene.input(true, 2, 'action');
			break;
		case 18: // Alt
			MovingScene.input(true, 0, 'action');
			break;
		case 32: // Space
    		MovingScene.input(true, 1, 'action');
			break;
		case 90: // z
			MovingScene.input(true, 0, 'up');
			break;
		case 81: // q
			MovingScene.input(true, 0, 'left');
			break;
		case 83: // s
			MovingScene.input(true, 0, 'down');
			break;
		case 68: // d
			MovingScene.input(true, 0, 'right');
			break;
		case 79: // o
		    MovingScene.input(true, 1, 'up');
			break;
		case 75: // k
    		MovingScene.input(true, 1, 'left');
			break;
		case 76: // l
			MovingScene.input(true, 1, 'down');
			break;
		case 77: // m
			MovingScene.input(true, 1, 'right');
			break;
		case 37: // Left
		    MovingScene.input(true, 2, 'left');
			break;
		case 38: // Up
		    MovingScene.input(true, 2, 'up');
			break;
		case 39: // Right
    		MovingScene.input(true, 2, 'right');
			break;
		case 40: // Down
    		MovingScene.input(true, 2, 'down');
			break;
		case 12: // 5
			MovingScene.input(true, 3, 'up');
			break;
		case 35: // 1
			MovingScene.input(true, 3, 'left');
			break;
		case 40: // 2
			MovingScene.input(true, 3, 'down');
			break;
		case 34: // 3
			MovingScene.input(true, 3, 'right');
			break;
	}
}, false);
document.addEventListener('keyup', event => {
    switch (event.keyCode) {
		case 17: // Ctrl
			MovingScene.input(false, 2, 'action');
			break;
		case 18: // Alt
			MovingScene.input(false, 0, 'action');
			break;
		case 32: // Space
			MovingScene.input(false, 1, 'action');
			break;
		case 90: // z
			MovingScene.input(false, 0, 'up');
			break;
		case 81: // q
			MovingScene.input(false, 0, 'left');
			break;
		case 83: // s
			MovingScene.input(false, 0, 'down');
			break;
		case 68: // d
			MovingScene.input(false, 0, 'right');
			break;
		case 79: // o
			MovingScene.input(false, 1, 'up');
			break;
		case 75: // k
			MovingScene.input(false, 1, 'left');
			break;
		case 76: // l
			MovingScene.input(false, 1, 'down');
			break;
		case 77: // m
			MovingScene.input(false, 1, 'right');
			break;
		case 37: // Left
			MovingScene.input(false, 2, 'left');
			break;
		case 38: // Up
			MovingScene.input(false, 2, 'up');
			break;
		case 39: // Right
			MovingScene.input(false, 2, 'right');
			break;
		case 40: // Down
			MovingScene.input(false, 2, 'down');
			break;
		case 12: // 5
			MovingScene.input(false, 3, 'up');
			break;
		case 35: // 1
			MovingScene.input(false, 3, 'left');
			break;
		case 40: // 2
			MovingScene.input(false, 3, 'down');
			break;
		case 34: // 3
			MovingScene.input(false, 3, 'right');
			break;
	}
}, false);

function PointerMove( event ) { 
	
    mouse.xp = event.clientX;
    mouse.yp = event.clientY;
	mouse.xd = mouse.xp-mouse.xs;
	mouse.yd = mouse.yp-mouse.ys;
	mouse.xs = event.clientX;
	mouse.ys = event.clientY;

	if (GUI) { //if mouse in GUI then interact
		event.preventDefault();
		//GUI.over = CheckMenuBox(mouse.xp,mouse.yp);
		//GUI.Over(event.clientX,event.clientY);
	} GalaxyOver();

	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// update over sprite position
	overimg.position.set( mouse.x * window.innerWidth/2, mouse.y * window.innerHeight/2, 0 );
}

function PointerClick (event) {
	mouse.t = true;
    // update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	//if (GUI) { // && CheckMenuBox()if mouse in GUI then interact
	//	event.preventDefault();
	//	GUI.Over(event.clientX,event.clientY);
	//} else { // if mouse in 3D call raycast
	//	GalaxyOver();
	//}
	MovingScene.input(true, 3, 'action');
}

function PointerRelease (event) {
	
	if (mouse.xt == event.clientX && mouse.yt == event.clientY) {
		mouse.c = true;
	}
	//if (GUI) {event.preventDefault();
	//	GUI.Over(event.clientX,event.clientY);
	//} GalaxyOver();
    mouse.d = false;
	mouse.c = false;
    mouse.t = false;
    MovingScene.input(false, 3, 'action');
}

var simpleSpriteTxt = new THREE.TextureLoader().load( './img/star.png' );
function getSimpleSprite(color,size) {
	var focusMaterial = new THREE.SpriteMaterial(
		{
			map: simpleSpriteTxt,
			color: color,
			transparent: false,
			blending: THREE.AdditiveBlending
		});
	var focusSprite = new THREE.Sprite( focusMaterial );
	    focusSprite.scale.set(size, size, 1.0);
	return focusSprite;
}

function CheckMenuBox() {
	/*This function help you to isolate portion of scren that must not interfer with 3D scene
	-> return true  if you are in the menu
	-> return false if you are in 3D scene 
	add menu box add the folowing line :
	flag = flag || CheckShape(XTL,XTR,YT,XBL,XBR,YB);
	where X is horizontal position, first char for top/bottom, second char for left/right
	where Y is verttical position, first char for top/bottom
	you can use negative value to use inveted alignement to scren borders
	(but you need to write them in assending order)
	examples :
	flag = flag || CheckShape(0,320,0,0,320,52);
	flag = flag || CheckShape(-320,-1,-52,-320,-1,-1);
	*/
	var flag = false;
	flag = flag || CheckShape(-300,-1,0,-300,-1,64);


	//if (GUI.menu.example.state=="active") {
	//	flag = flag || CheckShape(322,364,-52,322,364,-10);
	//}
	//if (flag)
	//	console.log("ITSIN");
	//else
	//	console.log("ITSOUT");
	return flag;
}

function CheckShape(x1,x2,y1,x3,x4,y2) {
	var sw = window.innerWidth;
	var sh = window.innerHeight;
	if (x1<0) x1 += (x1==-1?1:0)+sw;
	if (x2<0) x2 += (x2==-1?1:0)+sw;
	if (x3<0) x3 += (x3==-1?1:0)+sw;
	if (x4<0) x4 += (x4==-1?1:0)+sw;
	if (y1<0) y1 += (y1==-1?1:0)+sh;
	if (y2<0) y2 += (y2==-1?1:0)+sh;
	if (mouse.yp>=y1 && mouse.yp<=y2) {
		var perc = (mouse.yp-y1)/(y2-y1);
		if (mouse.xp>=(x1+(x3-x1)*perc) && mouse.xp<=(x2+(x4-x2)*perc)) {
			return true;
		}
	}
	return false;
}



document.addEventListener("keyup", KeyRelease);
function KeyRelease(evt) {
    if      (evt.keyCode == 27)
    	ForceResize();
    if      (evt.keyCode == 13)
    	LoginAuto();
    //if      (evt.keyCode == 32)//TORE
    //	socket.emit('AskForMore');
}

//DELAYER FUNCTION

(function() {
    var delayedarray = [];
    var launcharray  = [];

    function launch() {
    	if (delayedarray.length > 0) {
	    	//console.log(delayedarray);
	    	for (var i=0;i<delayedarray.length;i++)
	    		launcharray.push(delayedarray[i]);
	        delayedarray = [];
	        launcharray.forEach(function(func) { func(); });
	        launcharray  = [];
   		}
    }

    function add(func) {
        delayedarray.push(func);
    }

    window.delayer = { 
        add: add,
        launch: launch
    };
})();

//DUAL FUNCTION TO BE SURE TO RESIZE WELL
function ForceResize() {
    delayer.add(ResizeNow);
}//single works 60%
//dual works 100% fuck yeah !
function ResizeNow() {
    console.log("Screen has been forced to resize");
    window.dispatchEvent(new Event('resize'));   
}

//Multirole role text box to write text with auto line break. add "LB" to force a line break.
function TextBox(context,text,size,align,X,Y,W,H) {
	var lx = 0; var ly = Y+size;
	context.fillStyle = "rgba(255,255,255,0.5)"; context.textAlign = align; 
	if (align == "center") lx += (W/2);
	else if (align == "right") lx += W;
	context.font = size+"px continuummedium";
	
	var words = text.split(' ');
	var line = '';
	var lastline = false;
	
	for(var n = 0; n < words.length; n++) {
		if (words[n] == "LB") {
			testWidth = 999;
		} else {
			var testLine = line + words[n];
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
		}
		if (testWidth > W && n > 0) {
			if (ly+size < (Y+H)) {
				context.fillText(line, X+lx, ly);
				ly += 5/4*size;
				if (words[n] != "LB" && words[n].indexOf('-')==-1)
					line = words[n] + ' ';
				else
					line = '';
			} else {
				context.textAlign = "right"; 
				context.fillText("...", X+W, ly+8);
				lastline = true;
				break;
			}
		} else if (words[n].indexOf('-')!=-1) {
			while (words[n].indexOf('-')!=-1) {
				line = line + ' ';
				words[n] = words[n].slice(1,words[n].length);
		}}  else line = testLine + ' ';
	}
	if (!lastline)
		context.fillText(line, X+lx, ly);
}

//Set nice over effect / click effect on a input box
function GradientBox(mctx,xpos,ypos,width,hight) {
	var saveStyle = mctx.fillStyle
	mctx.globalCompositeOperation = "lighter";
	var gradient = mctx.createRadialGradient(xpos+width/2,ypos+hight/2,0,xpos+width/2,ypos+hight/2,Math.max(width/2,hight/2));
		gradient.addColorStop(0.0, "rgba(0,160,160,0.50)");
		gradient.addColorStop(0.4, "rgba(0,120,120,0.40)");
		gradient.addColorStop(1.0, "rgba(0,0,0,0.0)");
	mctx.fillStyle = gradient;
	mctx.fillRect(xpos,ypos,width,hight);
	mctx.globalCompositeOperation = "source-over";
	mctx.fillStyle = saveStyle;
}

function Gaussian(min,max) {
	return ((min+max)/2+(Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-3)/3*(max-min)/2);
}

function EF(nb) { // ALIAS FOR EXO FORMATER
	if (!isNaN(nb)) {
		if (nb<10)
			return Math.round(nb*100)/100;
		else if (nb < 1000)
			return Math.round(nb);
		else if (nb < 10000)
			return Math.round(nb/10)/100+"K";
        else if (nb < 100000)
            return Math.round(nb/100)/10+"K";
        else if (nb < 1000000)
            return Math.round(nb/1000)+"K";
        else if (nb < 10000000)
            return Math.round(nb/10000)/100+"M";
        else if (nb < 100000000)
            return Math.round(nb/100000)/10+"M";
        else if (nb < 1000000000)
            return Math.round(nb/1000000)+"M";
        else if (nb < 10000000000)
            return Math.round(nb/10000000)/100+"G";
        else if (nb < 100000000000)
            return Math.round(nb/100000000)/10+"G";
        else if (nb < 1000000000000)
            return Math.round(nb/1000000000)+"G";
        else if (nb < 10000000000000)
            return Math.round(nb/10000000000)/100+"T";
        else if (nb < 100000000000000)
            return Math.round(nb/100000000000)/10+"T";
        else if (nb < 1000000000000000)
            return Math.round(nb/1000000000000)+"T";
        else if (nb < 10000000000000000)
            return Math.round(nb/10000000000000)/100+"P";
        else if (nb < 100000000000000000)
            return Math.round(nb/100000000000000)/10+"P";
        else if (nb < 1000000000000000000)
            return Math.round(nb/1000000000000000)+"P";
		else
			return Math.round(nb);
	}
	else return nb;
}

function ET(time) { // ALIAS FOR EXO TIME
	if (time < 31536)
		return Math.round(time/86.4)+" days";
	else
		return Math.round(time/31536)+" years";
}

function EFP(nb) { // ALIAS FOR EXO FORMATER PERCENTAGE
	if (nb < 0.1)
		return Math.round(nb*1000)/10+"%";
	else
		return Math.round(nb*100)+"%";
}

//In case theme is greece :p
function GreekFont(index) { switch(index) {
	case 0 : return "Α";
	case 1 : return "Β";
	case 2 : return "Γ";
	case 3 : return "Δ";
	case 4 : return "Ε";
	case 5 : return "Ζ";
	case 6 : return "Η";
	case 7 : return "Θ";
	case 8 : return "Ι";
	case 9 : return "Κ";
	case 10: return "Λ";
	case 11: return "Μ";
	case 12: return "Ν";
	case 13: return "Ξ";
	case 14: return "Ο";
	case 15: return "Π";
	case 16: return "Ρ";
	case 17: return "Σ";
	case 18: return "Τ";
	case 19: return "Υ";
	case 20: return "Φ";
	case 21: return "Χ";
	case 22: return "Ψ";
	case 23: return "Ω";
	default: return "ERROR";
}}

//Util function to let client download some file, cool for file based import/export save system
function Download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}

//IMAGE LOADER
//CAPITAL FOR EVERY IMG USED IN CANVAS
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

//ADD ALL IMAGE YOU NEED HERE 
resources.load([
	//NEW
	'img/focus.jpg',
	'img/focus.png',
	'img/tech.png',
	//MISC
	'img/music.png'
]);

//Advanced Encoding systeme for large data file to be included
function Encode128(val) { switch (val) {
	case   0 : return ' ';
	case   1 : return '!';
	case   2 : return '"';
	case   3 : return '#';
	case   4 : return '$';
	case   5 : return '%';
	case   6 : return '&';
	case   7 : return '(';
	case   8 : return ')';
	case   9 : return '*';
	case  10 : return '+';
	case  11 : return ',';
	case  12 : return '-';
	case  13 : return '.';
	case  14 : return '/';
	case  15 : return '0';
	case  16 : return '1';
	case  17 : return '2';
	case  18 : return '3';
	case  19 : return '4';
	case  20 : return '5';
	case  21 : return '6';
	case  22 : return '7';
	case  23 : return '8';
	case  24 : return '9';
	case  25 : return ':';
	case  26 : return ';';
	case  27 : return '<';
	case  28 : return '=';
	case  29 : return '>';
	case  30 : return '?';
	case  31 : return '@';
	case  32 : return 'A';
	case  33 : return 'B';
	case  34 : return 'C';
	case  35 : return 'D';
	case  36 : return 'E';
	case  37 : return 'F';
	case  38 : return 'G';
	case  39 : return 'H';
	case  40 : return 'I';
	case  41 : return 'J';
	case  42 : return 'K';
	case  43 : return 'L';
	case  44 : return 'M';
	case  45 : return 'N';
	case  46 : return 'O';
	case  47 : return 'P';
	case  48 : return 'Q';
	case  49 : return 'R';
	case  50 : return 'S';
	case  51 : return 'T';
	case  52 : return 'U';
	case  53 : return 'V';
	case  54 : return 'W';
	case  55 : return 'X';
	case  56 : return 'Y';
	case  57 : return 'Z';
	case  58 : return '[';
	case  59 : return '~';
	case  60 : return ']';
	case  61 : return '^';
	case  62 : return '_';
	case  63 : return '`';
	case  64 : return 'a';
	case  65 : return 'b';
	case  66 : return 'c';
	case  67 : return 'd';
	case  68 : return 'e';
	case  69 : return 'f';
	case  70 : return 'g';
	case  71 : return 'h';
	case  72 : return 'i';
	case  73 : return 'j';
	case  74 : return 'k';
	case  75 : return 'l';
	case  76 : return 'm';
	case  77 : return 'n';
	case  78 : return 'o';
	case  79 : return 'p';
	case  80 : return 'q';
	case  81 : return 'r';
	case  82 : return 's';
	case  83 : return 't';
	case  84 : return 'u';
	case  85 : return 'v';
	case  86 : return 'w';
	case  87 : return 'x';
	case  88 : return 'y';
	case  89 : return 'z';
	case  90 : return '{';
	case  91 : return '|';
	case  92 : return '}';
	case  93 : return 'Ø';
	case  94 : return 'ø';
	case  95 : return '¡';
	case  96 : return '¢';
	case  97 : return '£';
	case  98 : return '¤';
	case  99 : return '¥';
	case 100 : return '¦';
	case 101 : return '§';
	case 102 : return '¨';
	case 103 : return '©';
	case 104 : return 'ª';
	case 105 : return '«';
	case 106 : return '¬';
	case 107 : return '­';
	case 108 : return '®';
	case 109 : return '¯';
	case 110 : return '°';
	case 111 : return '±';
	case 112 : return '²';
	case 113 : return '³';
	case 114 : return '´';
	case 115 : return 'µ';
	case 116 : return '¶';
	case 117 : return '·';
	case 118 : return '¸';
	case 119 : return '¹';
	case 120 : return 'º';
	case 121 : return '»';
	case 122 : return '¼';
	case 123 : return '½';
	case 124 : return '¾';
	case 125 : return '¿';
	case 126 : return 'Æ';
	case 127 : return 'Ç';
	default : console.log("Encode Out Of Range"); return 'Ø';
}}

function Decode128(val) { switch (val) {
	case ' ' : return   0 ;
	case '!' : return   1 ;
	case '"' : return   2 ;
	case '#' : return   3 ;
	case '$' : return   4 ;
	case '%' : return   5 ;
	case '&' : return   6 ;
	case '(' : return   7 ;
	case ')' : return   8 ;
	case '*' : return   9 ;
	case '+' : return  10 ;
	case ',' : return  11 ;
	case '-' : return  12 ;
	case '.' : return  13 ;
	case '/' : return  14 ;
	case '0' : return  15 ;
	case '1' : return  16 ;
	case '2' : return  17 ;
	case '3' : return  18 ;
	case '4' : return  19 ;
	case '5' : return  20 ;
	case '6' : return  21 ;
	case '7' : return  22 ;
	case '8' : return  23 ;
	case '9' : return  24 ;
	case ':' : return  25 ;
	case ';' : return  26 ;
	case '<' : return  27 ;
	case '=' : return  28 ;
	case '>' : return  29 ;
	case '?' : return  30 ;
	case '@' : return  31 ;
	case 'A' : return  32 ;
	case 'B' : return  33 ;
	case 'C' : return  34 ;
	case 'D' : return  35 ;
	case 'E' : return  36 ;
	case 'F' : return  37 ;
	case 'G' : return  38 ;
	case 'H' : return  39 ;
	case 'I' : return  40 ;
	case 'J' : return  41 ;
	case 'K' : return  42 ;
	case 'L' : return  43 ;
	case 'M' : return  44 ;
	case 'N' : return  45 ;
	case 'O' : return  46 ;
	case 'P' : return  47 ;
	case 'Q' : return  48 ;
	case 'R' : return  49 ;
	case 'S' : return  50 ;
	case 'T' : return  51 ;
	case 'U' : return  52 ;
	case 'V' : return  53 ;
	case 'W' : return  54 ;
	case 'X' : return  55 ;
	case 'Y' : return  56 ;
	case 'Z' : return  57 ;
	case '[' : return  58 ;
	case '~' : return  59 ;
	case ']' : return  60 ;
	case '^' : return  61 ;
	case '_' : return  62 ;
	case '`' : return  63 ;
	case 'a' : return  64 ;
	case 'b' : return  65 ;
	case 'c' : return  66 ;
	case 'd' : return  67 ;
	case 'e' : return  68 ;
	case 'f' : return  69 ;
	case 'g' : return  70 ;
	case 'h' : return  71 ;
	case 'i' : return  72 ;
	case 'j' : return  73 ;
	case 'k' : return  74 ;
	case 'l' : return  75 ;
	case 'm' : return  76 ;
	case 'n' : return  77 ;
	case 'o' : return  78 ;
	case 'p' : return  79 ;
	case 'q' : return  80 ;
	case 'r' : return  81 ;
	case 's' : return  82 ;
	case 't' : return  83 ;
	case 'u' : return  84 ;
	case 'v' : return  85 ;
	case 'w' : return  86 ;
	case 'x' : return  87 ;
	case 'y' : return  88 ;
	case 'z' : return  89 ;
	case '{' : return  90 ;
	case '|' : return  91 ;
	case '}' : return  92 ;
	case 'Ø' : return  93 ;
	case 'ø' : return  94 ;
	case '¡' : return  95 ;
	case '¢' : return  96 ;
	case '£' : return  97 ;
	case '¤' : return  98 ;
	case '¥' : return  99 ;
	case '¦' : return 100 ;
	case '§' : return 101 ;
	case '¨' : return 102 ;
	case '©' : return 103 ;
	case 'ª' : return 104 ;
	case '«' : return 105 ;
	case '¬' : return 106 ;
	case '­' : return 107 ;
	case '®' : return 108 ;
	case '¯' : return 109 ;
	case '°' : return 110 ;
	case '±' : return 111 ;
	case '²' : return 112 ;
	case '³' : return 113 ;
	case '´' : return 114 ;
	case 'µ' : return 115 ;
	case '¶' : return 116 ;
	case '·' : return 117 ;
	case '¸' : return 118 ;
	case '¹' : return 119 ;
	case 'º' : return 120 ;
	case '»' : return 121 ;
	case '¼' : return 122 ;
	case '½' : return 123 ;
	case '¾' : return 124 ;
	case '¿' : return 125 ;
	case 'Æ' : return 126 ;
	case 'Ç' : return 127 ;
	default : console.log(val+" Decode Out Of Range"); return 0;
}}