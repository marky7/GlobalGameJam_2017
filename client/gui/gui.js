var GUI = false;
// MAIN GUI =======================================================================================
function MainGui() {
	this.mode;

	this.tl = new GuiCorner(0,0);
	this.lb = new GuiBar(0);
	this.bl = new GuiCorner(0,1);

	this.tr = new GuiCorner(1,0);
	this.rb = new GuiBar(1);
	this.br = new GuiCorner(1,1);

	this.menu = new GuiMenu();

	//this.box = THREE.ImageUtils.loadTexture('img/box.png');

	this.Update = function(instruction) {
		this.SetMode(instruction);

		this.tl.Update(this.mode.tl);
		//this.lb.Update(mode); ul
		this.bl.Update(this.mode.bl);

		this.tr.Update(this.mode.tr);
		//this.rb.Update(mode); ul
		this.br.Update(this.mode.br);

		this.menu.Update(this.mode.menu);
		this.mode.menu = 0; //stop menu disroption

		this.Draw();
	}

	this.SetMode = function(instruction) { switch(instruction) {
		case "Reset" : this.mode = {"tl":0,"bl":0,"tr":0,"br":0,"menu":0}; break;
		case "Maps"  : this.mode.bl = 1; break;
		case "Tools" : this.mode.bl = 0; break;
		case "BBase" : this.mode.tr = 1; break;
		case "BAdv." : this.mode.tr = 2; break;
		case "Tech0" : this.mode.tr = 3; break; //Tech Main
		case "Tech1" : this.mode.tr = 4; break; //P1 Tech
		case "Tech2" : this.mode.tr = 5; break; //P2 Tech
		case "Tech3" : this.mode.tr = 6; break; //Tech
		case "Tech4" : this.mode.tr = 7; break; //Tech
		case "Tech5" : this.mode.tr = 8; break; //Tech
		case "Tech6" : this.mode.tr = 9; break; //Tech
		case "Prod"  : this.mode.tr =10; break;
		case "Blank" : this.mode.br = 0; break;
		case "Const" : this.mode.br = 1; break;
		case "Tech"  : this.mode.br = 2; break;
		case "GMap"  : this.mode.tr =20; this.mode.br =20; break;
		case "manage": this.mode.menu = "00"; break;
		case "delay" : this.mode.menu = "01"; break;
		case "build" : this.mode.menu = "11"; break;
		case "all"   : this.mode.menu = "all"; break;
		case "none"  : this.mode.menu = "none"; break;
		default : console.log("Invalid GUI instruction"); break;
	}}

	this.Draw = function() { infocount[1]++;
		Now();

		this.tl.Draw();
		this.lb.Draw();
		this.bl.Draw();

		this.tr.Draw();
		this.rb.Draw();
		this.br.Draw();

		this.menu.Draw();
	}

	this.over = false;
	this.Over = function(ex,ey) { infocount[3]++;
		//this.over = false;
		if (ex < window.innerWidth/2) {
			this.over = this.tl.Over(ex,ey) || this.over ;
			this.over = this.lb.Over(ex,ey+512-window.innerHeight/2) || this.over ;
			this.over = this.bl.Over(ex,ey+512-window.innerHeight) || this.over ;
		}
		else {
			this.over = this.tr.Over(ex+512-window.innerWidth-this.hide[1]*8,ey) || this.over ;
			this.over = this.rb.Over(ex+512-window.innerWidth-this.hide[1]*8,ey+512-window.innerHeight/2) || this.over ;
			this.over = this.br.Over(ex+512-window.innerWidth-this.hide[1]*8,ey+512-window.innerHeight) || this.over ;
		}

		this.menu.Over(ex,ey);
	}

	this.hide = [0,0,0,0];
	this.HideBar = function(x) {
		if (this.hide[x] == 0) {
			this.hide[x+2]++;
			if (this.hide[x+2] == 1) {
				this.hide[x]++;
				this.Move(x,true);
				if 	(x>0) 	delayer.add(this.HideRightBar);
				else 		delayer.add(this.HideLeftBar);
			}
		}
		else if (this.hide[x] == 40) {
			this.hide[x+2]--;
			if (this.hide[x+2] == -1) {
				this.hide[x]--;
				this.Move(x,false);
				if 	(x>0) 	delayer.add(this.HideRightBar);
				else 		delayer.add(this.HideLeftBar);
			}
		}
		else if (this.hide[x+2] == true) {
			this.hide[x]++;
			this.Move(x,true);
			if 	(x>0) 	delayer.add(this.HideRightBar);
			else 		delayer.add(this.HideLeftBar);
		}
		else {
			this.hide[x]--;
			this.Move(x,false);
			if 	(x>0) 	delayer.add(this.HideRightBar);
			else 		delayer.add(this.HideLeftBar);
		}
	}

	this.HideLeftBar = function() {
		GUI.HideBar(0);
	}

	this.HideRightBar = function() {
		GUI.HideBar(1);
	}

	this.Move = function(mode,bool) { 
		if (mode>0) {
			if (bool) 	{ this.tr.Hide(1); this.rb.Hide(1); this.br.Hide(1); }
			else 		{ this.tr.Hide(0); this.rb.Hide(0); this.br.Hide(0); }
		}
		else {
			if (bool) 	{ this.tl.Hide(0); this.lb.Hide(0); this.bl.Hide(0); }
			else 		{ this.tl.Hide(1); this.lb.Hide(1); this.bl.Hide(1); }
		}
	}

	this.selected = "null";

	this.Select = function(newsel) {
		if (this.selected == newsel)
			this.selected = "null";
		else
			this.selected = newsel;
		this.rb.Update(this.selected);
		this.menu.Select(this.selected);
		if (LIGHT) LIGHT.Select(this.selected);
		GuiProgress(this.selected/*,base_data[base_sel].active,techno_data.active*/);
	}

	/*this.FontLoader = function() {
		window.setTimeout(this.Draw,200);
		window.setTimeout(this.Draw,400);
		window.setTimeout(this.Draw,600);
		window.setTimeout(this.Draw,800);
		window.setTimeout(this.Draw,999);
	}*/

	this.Resize = function() {
		var goodwidth  = document.documentElement.clientWidth;
		var goodheight = document.documentElement.clientHeight;

		this.tl.Resize(goodwidth,goodheight);
		this.lb.Resize(goodwidth,goodheight);
		this.bl.Resize(goodwidth,goodheight);

		this.tr.Resize(goodwidth,goodheight);
		this.rb.Resize(goodwidth,goodheight);
		this.br.Resize(goodwidth,goodheight);
		//tobe sure that size is correct
		this.menu.Resize();
	}

	this.Update("Reset");
	//this.timer = setInterval(GUI.Draw,1000);
	//this.FontLoader();
	//resources.onReady(this.Draw);
}

// CORNER GUI =====================================================================================
function GuiCorner(x,y) {
	var name = "gui-"+x+"-"+y;
	var x = x;
	var y = y;

	var gcvs = document.createElement('canvas');
		gcvs.width  = 512;
		gcvs.height = 512;

	var gctx = gcvs.getContext('2d');

	var gtxt =new THREE.Texture(gcvs) 
		gtxt.needsUpdate = true;

	var gmat = new THREE.SpriteMaterial( { map: gtxt } );

	var gimg = new THREE.Sprite( gmat );
		gimg.scale.set(512,512,1.0);
		gimg.position.set( (2*x-1)*(window.innerWidth/2-256), (1-2*y)*(window.innerHeight/2-256), 0 );

	guisc.add( gimg );

	this.but0 = new GuiDisplay(x,y,0);
	this.but1 = new GuiButton(x,y,0,0);
	this.but2 = new GuiButton(x,y,1,0);
	this.but3 = new GuiButton(x,y,2,0);
	this.but4 = new GuiButton(x,y,3,0);
	this.but5 = new GuiButton(x,y,4,0);
	this.but6 = new GuiButton(x,y,5,0);
	this.but7 = new GuiButton(x,y,6,0);

	this.Update = function(mode){
		this.but0.Update(mode);
		this.but1.Update(mode);
		this.but2.Update(mode);
		this.but3.Update(mode);
		this.but4.Update(mode);
		this.but5.Update(mode);
		this.but6.Update(mode);
		this.but7.Update(mode);
		/*this.but0 = new GuiDisplay(x,y,mode);
		this.but1 = new GuiButton(x,y,0,mode);
		this.but2 = new GuiButton(x,y,1,mode);
		this.but3 = new GuiButton(x,y,2,mode);
		this.but4 = new GuiButton(x,y,3,mode);
		this.but5 = new GuiButton(x,y,4,mode);
		this.but6 = new GuiButton(x,y,5,mode);
		this.but7 = new GuiButton(x,y,6,mode);*/
	}

	this.Draw = function() {
		gctx.clearRect(0,0,512,512);
		this.but0.Draw(gctx);
		this.but1.Draw(gctx);
		this.but2.Draw(gctx);
		this.but3.Draw(gctx);
		this.but4.Draw(gctx);
		this.but5.Draw(gctx);
		this.but6.Draw(gctx);
		this.but7.Draw(gctx);

		gtxt.needsUpdate = true;
	}

	this.over = false;
	this.Over = function(ex,ey){
		this.over = false;
		this.over = this.but0.Over(ex,ey) || this.over;
		this.over = this.but1.Over(ex,ey) || this.over;
		this.over = this.but2.Over(ex,ey) || this.over;
		this.over = this.but3.Over(ex,ey) || this.over;
		this.over = this.but4.Over(ex,ey) || this.over;
		this.over = this.but5.Over(ex,ey) || this.over;
		this.over = this.but6.Over(ex,ey) || this.over;
		this.over = this.but7.Over(ex,ey) || this.over;
		return this.over;
	}

	this.Hide = function(way) {
		way>0?gimg.position.x+=8:gimg.position.x-=8;
	}

	this.Resize = function(gw,gh) {
		gimg.position.set( (2*x-1)*(gw/2-256), (1-2*y)*(gh/2-256), 0 );
	}
}

// BAR GUI ========================================================================================
function GuiBar(x) {
	var name = "gui-"+x;
	var x = x;
	var overed = false;

	var image = resources.get("img/bar"+x+".png");

	var gcvs = document.createElement('canvas');
		gcvs.width  = 512;
		gcvs.height = 1024;

	var gctx = gcvs.getContext('2d');
		gctx.font = "Bold 20px Arial";
		gctx.fillStyle = "rgba(255,0,0,0.80)";
		gctx.fillRect(0, 0, 20, 20);

	var gtxt =new THREE.Texture(gcvs) 
		gtxt.needsUpdate = true;

	var gmat = new THREE.SpriteMaterial( { map: gtxt } );

	var gimg = new THREE.Sprite( gmat );
		gimg.scale.set(512,1024,1.0);
		gimg.position.set( (2*x-1)*(window.innerWidth/2-256), 0, 0 );

	guisc.add( gimg );

	var text = "";

	var way = false;
	var be = 0;
	var bx = 0+(367-be)*x;//231gap
	var by = 512-window.innerHeight/2+300;
	var bw = 145+be;//231gap
	var bh = Math.max(window.innerHeight-600,0);

	this.Update = function(mode){
		text = desc_data[mode];
	}


	this.Draw = function() {
		gctx.clearRect(0,0,512,1024);
		
		if (bh>=80) {
		// 9 part image draw #adaptivesize
			gctx.drawImage(image,0, 0,20,40,bx,by,20,40);
			gctx.drawImage(image,0,39,20, 2,bx,by+40,20,bh-80);
			gctx.drawImage(image,0,40,20,40,bx,by+bh-40,20,40);

			gctx.drawImage(image,20, 0,48,40,bx+20,by,bw-40,40);
			gctx.drawImage(image,20,39,48, 2,bx+20,by+40,bw-40,bh-80);
			gctx.drawImage(image,20,40,48,40,bx+20,by+bh-40,bw-40,40);
			
			gctx.drawImage(image,68, 0,20,40,bx+bw-20,by,20,40);
			gctx.drawImage(image,68,39,20, 2,bx+bw-20,by+40,20,bh-80);
			gctx.drawImage(image,68,40,20,40,bx+bw-20,by+bh-40,20,40);
		}
		else if (bh>10) {
		// 6 part image draw #adaptivesize
			gctx.drawImage(image,0,      0,20,bh/2,bx,by     ,20,bh/2);
			gctx.drawImage(image,0,80-bh/2,20,bh/2,bx,by+bh/2,20,bh/2);

			gctx.drawImage(image,20,      0,48,bh/2,bx+20,by     ,bw-40,bh/2);
			gctx.drawImage(image,20,80-bh/2,48,bh/2,bx+20,by+bh/2,bw-40,bh/2);
			
			gctx.drawImage(image,68,      0,20,bh/2,bx+bw-20,by     ,20,bh/2);
			gctx.drawImage(image,68,80-bh/2,20,bh/2,bx+bw-20,by+bh/2,20,bh/2);	
		}
		//gctx.fillRect(bx,by,bw,bh);
		
		if (overed) {
			if ( bh >= 20 ) {
				gctx.globalCompositeOperation = "lighter";

				var gradient = ctx.createRadialGradient(bx+bw/2,by+bh/2,0,bx+bw/2,by+bh/2,bh/2-10);
				gradient.addColorStop(0.0, "rgba(0,80,80,0.50)");
				gradient.addColorStop(1.0, "rgba(0,0,0,0.0)");
				gctx.fillStyle = gradient;
				gctx.fillRect(bx+10,by+2,bw-20,bh-4);
				if (bh >= 80) { // fill adjustment
					if (x<1)	gctx.fillRect(bx+bw-10,by+30,8,bh-60);
					else		gctx.fillRect(bx+2,by+30,8,bh-60);
				}
				gctx.globalCompositeOperation = "source-over";
			}
		}
		if (x>0) TextBox(gctx,text,16,"right",bx+12,by+12,bw-24,bh-24);
		else     Notification(gctx,15,bx+12,by+12,bw-21,bh-24);

		gtxt.needsUpdate = true;
		//console.log(by,bh);
	}

	this.Over = function(ex,ey) {
		if (ey > by && ey < (by+bh)) {
			//hide button
			if (x<1 && mouse.xp < 10) {
				if (mouse.t) {
					GUI.HideBar(0);
					GUI.menu.Hide("delay",true);
					GUI.menu.Hide("manage",true);
					mouse.t=false;
				}
			}
			else if (x>0 && mouse.xp > (window.innerWidth-10)) {
				if (mouse.t) {
					GUI.HideBar(1);
					GUI.menu.Hide("state",true);
					GUI.menu.Hide("build",true);
					mouse.t=false;
				} // security bonus
			}

			//real over
			else if (ex > bx && ex < (bx +bw)) {
				if (!overed) {
					overed = true; GUI.Draw();
				}
				if (mouse.t) {
					way = !way;
					this.Expand();
					GUI.Draw();
					mouse.t = false;
					if (!way && x<1) SetNotification(); 
				}
				//console.log(name + " overed");
				return overed;
			}
		}
		if (overed) {
			overed = false; GUI.Draw();
		}
		return overed;
	}

	this.Expand = function() {
		if (be<231 && way==true) {
			be += 21;
			if (be<231) delayer.add(this.Expander);
			else image = resources.get("img/baro"+x+".png");
		}
		else if (be>0 && way==false) {
			be -= 21;
			if (be>0) delayer.add(this.Expander);
			else image = resources.get("img/bar"+x+".png");
		}
		bx = 0+(367-be)*x;//231gap
		bw = 145+be;//231gap
		this.Draw();
	}

	this.Expander = function() {
		if (x<1) GUI.lb.Expand();
		if (x>0) GUI.rb.Expand();
	}

	this.Hide = function(way) {
		way>0?gimg.position.x+=8:gimg.position.x-=8;
		if (x>0) {
			if (gimg.position.x > (window.innerWidth/2 - 122))
				gimg.position.x = (window.innerWidth/2 - 122);
			if (gimg.position.x < (window.innerWidth/2 - 256))
				gimg.position.x = (window.innerWidth/2 - 256);
		}
		else {	
			if (gimg.position.x < (-window.innerWidth/2 + 122))
				gimg.position.x = (-window.innerWidth/2 + 122);
			if (gimg.position.x > (-window.innerWidth/2 + 256))
				gimg.position.x = (-window.innerWidth/2 + 256);
		}
	}

	this.Resize = function(gw,gh) {
		by = 512-gh/2+300;
		bh = Math.max(gh-600,0);
		gimg.position.set( (2*x-1)*(gw/2-256), 0, 0 );
	}
}

// BUTTON GUI =====================================================================================
function GuiButton(x,y,id,mode) {
	var bw = 192-8*id;
	var bh = 32;
	var bx = x*(512-bw);
	var by = (1-2*y)*(76+32*id)+y*(512-bh);
	var overed = false;
	var locked = false;
	var callback;

	var image = resources.get("img/box"+x+""+y+".png");
	//temp
	var id = ""+x+"-"+y+"-"+id;
	var name;

	this.Update = function(mode) {
		var code = id + "-" + mode;
		name = gui_data[code].name;
		// IMPORTANT CALLBACK
		callback = gui_data[code].cb;
	}

	this.Draw = function(context) {
		//context.fillStyle = fillstyle;
		//context.fillRect(bx,by,bw,bh);
		context.drawImage(image,0,0,20,32,bx,by,20,bh);
		context.drawImage(image,20,0,40,32,bx+20,by,bw-40,bh);
		context.drawImage(image,60,0,20,32,bx+bw-20,by,20,bh);

		context.font = "Bold 20px continuummedium";
		if ((typeof callback) == "function" && callback.toString() != "function (){}")
			context.fillStyle = "rgba(0,255,255,0.80)";
		else
			context.fillStyle = "rgba(0,128,128,0.80)";
		if (bx == 0) {
			context.textAlign = "left";
			context.fillText(name, bx+16, by+24);
		}
		else {
			context.textAlign = "right";
			context.fillText(name, bx+bw-16, by+24);
		}

		if (overed || locked) {

			context.globalCompositeOperation = "lighter";

			var gradient = ctx.createRadialGradient(bx+bw/2,by+bh/2,0,bx+bw/2,by+bh/2,bw/2-10);
			gradient.addColorStop(0.0, "rgba(0,160,160,0.50)");
			gradient.addColorStop(0.4, "rgba(0,120,120,0.40)");
			gradient.addColorStop(1.0, "rgba(0,0,0,0.0)");
			context.fillStyle = gradient;
			context.fillRect(bx+10,by+2,bw-20,bh-4);

			context.globalCompositeOperation = "source-over";
		}
	}

	this.Over = function(ex,ey) {
		if (ex > bx && ex < (bx +bw) && ey > by && ey < (by+bh)) {
			if (!overed) {
				overed = true; GUI.Draw();
			}
			if (mouse.t) {
				callback();
				mouse.t=false; // security bonus
			}
			//console.log(name + " overed");
			return overed;
		}
		if (overed) {
			overed = false; GUI.Draw();
		}
		return overed;
	}

	this.Lock = function(flag) {
		locked = flag;
	}

	this.Update(mode);
}

// DISPLAY GUI ====================================================================================
function GuiDisplay(x,y,mode) {
	var fillstyle = "#008888";
	var bw = 320;
	var bh = 76;
	var bx = x*(512-bw);
	var by = y*(512-bh);

	var image = resources.get("img/display"+x+""+y+".png");

	this.Update = function(mode) {

	}

	this.Draw = function(context) {
		context.drawImage(image,bx,by);
		if (bx == 192) { 
			if (by ==0) {
				var data = gui_data['display10'];
				
				context.textAlign = "center";
				context.font = "Bold 16px continuummedium";
				context.fillStyle = "rgba(255,255,255,0.80)";
				context.fillText(data.title.txt, bx+data.title.xc, by+data.title.yc);

				context.font = "Bold 12px continuummedium";
				context.fillStyle = "rgba(0,255,255,0.80)";
				for (var i=0;i<data.cvar.length;i++) {
					context.fillText( EF(data.cvar[i].val()), bx+data.cvar[i].xc, by+data.cvar[i].yc);
				}
				for (var i=0;i<data.pvar.length;i++) {
					context.fillText( EFP(data.pvar[i].val()), bx+data.pvar[i].xc, by+data.pvar[i].yc);
				}
			}
			else if (by == 436) {
				var data = gui_data['display11'];
				
				context.textAlign = "center";
				context.font = "Bold 16px continuummedium";
				context.fillStyle = "rgba(255,255,255,0.80)";
				context.fillText(data.title.txt, bx+data.title.xc, by+data.title.yc);

				context.font = "Bold 12px continuummedium";
				context.fillStyle = "rgba(0,255,255,0.80)";
				for (var i=0;i<data.cvar.length;i++) {
					context.fillText( EF(data.cvar[i].val()), bx+data.cvar[i].xc, by+data.cvar[i].yc);
				}
				for (var i=0;i<data.pvar.length;i++) {
					context.fillText( EFP(data.pvar[i].val()), bx+data.pvar[i].xc, by+data.pvar[i].yc);
				}
			}
			else
				console.log("error display draw");
		}
		else if (bx == 0)  {
			if (by ==0) {
				context.drawImage(resources.get("img/avatar"+0+".png"),bx+2,by+24);
				context.textAlign = "center";
				context.font = "Bold 16px continuummedium";
				context.fillStyle = "rgba(255,255,255,0.80)";
				context.fillText(player_data.name, 78, by+18);

				context.textAlign = "left";
				context.font = "Bold 12px continuummedium";
				if (player_data.corp != 0) context.fillText("member of "+player_data.corp+" corporation", 64, by+37);
				else  context.fillText("Independant Commander", 64, by+37);
				context.fillText("Strength", 269, by+55);
				context.fillText("Time", 269, by+68);
				context.fillStyle = "rgba(0,255,255,0.80)";
				context.fillText(player_data.title, 145, by+23);

				context.textAlign = "right";
				context.fillStyle = "rgba(255,255,255,0.80)";
				context.fillText("Planet Bases", 135, by+55);
				context.fillText("Active Fleets", 135, by+68);

				context.textAlign = "center";
				context.fillText("Empire", 295, by+40);
				context.fillStyle = "rgba(0,255,255,0.80)";

				context.fillText(player_data.basec+" / "+player_data.basem, 162, by+55);
				context.fillText(player_data.fleetc+" / "+player_data.fleetm, 162, by+68);
				context.fillText(player_data.points, 244, by+55); 
				context.fillText(GetPlayerTime()/*+"y"*/, 244, by+68);
			}
			else if (by == 436) {
				context.textAlign = "center";
				context.font = "Bold 16px continuummedium";
				context.fillStyle = "rgba(255,255,255,0.80)";
				context.fillText("Location", 78, by+70);

				context.textAlign = "left";
				context.fillText("GC :", 10, by+20);
				context.fillStyle = "rgba(0,255,255,0.80)";
				context.font = "Bold 16px arial";
				if (START)
				context.fillText(GetSystemLocation(base_data[base_sel].syst,"text"), 40, by+20);

				context.font = "10px continuummedium";
				context.fillText("Angle", 165, by+24);
				context.fillText("Altitude", 169, by+44);
				context.fillText("Radius", 153, by+56);

				context.drawImage(resources.get("img/music.png"),bx+321,by+23,45,45);
			}
			else
				console.log("error display draw");
		}
		else
			console.log("error display draw");
	}
			/*context.drawImage(image,0,0,20,32,bx,by,48,bh);
			context.drawImage(image,20,0,40,32,bx+48,by,bw-96,bh);
			context.drawImage(image,60,0,20,32,bx+bw-48,by,48,bh);*/

	//temp
	var name = "gui-"+x+"-"+y+"-d";
	this.Over = function(ex,ey) {
		if (ex >= bx && ex <= (bx +bw) && ey >= by && ey <= (by+bh)) {
			//console.log(name + " overed")
			return true;
		}
		else if (ex >= (bx+bw+1) && ex <= (bx+bw+46) && ey >= (by+23) && ey <= (by+68)) {
			if (mouse.t) {
				Mute();
				mouse.t = false;
			}
			return true;
		}
		return false;
	}
}

// CONSTRUCTER GUI ================================================================================
function BuildGui() {
	GUI = new MainGui();
}
