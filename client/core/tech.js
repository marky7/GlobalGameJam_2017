var TECHNO = new THREE.Object3D();

TECHNO.show = function() { if (!TECHNO.visible) {
	HideAll();
	TECHNO.visible = true;
	controls.minDistance =  250;
	controls.maxDistance = 10000;
	controls.userPanSpeed = 4;
	camera.position.set(0,1500,2000);
    controls.center.set(0,0,0); 
    controls.traveling(new THREE.Vector3(),2500);
}};

var Node = function(data) {
	this.id = data.id;
	this.unlock = true;//data.name?true:false;//this.id%10==0?true:true;//(Math.random()>0.5?true:false);
	this.link = data.link;
	this.position = new THREE.Vector3(data.x,data.y,data.z);
	//var material = new THREE.MeshBasicMaterial( { color: 0x0088dd, wireframe: true } );
	var material = new THREE.MeshBasicMaterial( { color: this.unlock?0xffffff:0x444444, envMap: scene.background  } );//
	var geometry = new THREE.SphereBufferGeometry(200, 32, 32);
	var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(data.x*1000,data.y*1000,data.z*1000);
		mesh.name = data.name;
		mesh.tid  = data.id;
	TECHNO.add(mesh);
	TECHNO.over.push(mesh);
	for(var i=0;i<this.link.length;i++){
		if (this.link[i]<this.id) {
			if (GetNode(this.link[i]).unlock && this.unlock)
				TECHNO.Link(this.position,GetNodePos(this.link[i]));
		}
	}
};

function GetNodePos(id) {
	for (var i=0;i<TECHNO.data.length;i++) {
		var d = TECHNO.data[i];
		if (id == d.id) { 
		return new THREE.Vector3(d.x,d.y,d.z);
	}}
	return new THREE.Vector3();//default
}

function GetNode(id) {
	for (var i=0;i<TECHNO.node.length;i++) {
		var n = TECHNO.node[i];
		if (id == n.id) { 
			if (n.unlock)
				return n;
			break;
	}}
	return false;
}

function GetNodePts(id) {
	if 		(id%10 == 0) return 100;
	else if (id%10 == 5) return 250;
	else if (id%10  < 5) return 150;
	else if (id%10  > 5) return 200;
}

function GetNodeVic(id) {
	if 		(id%10 == 0) return  0;
	else if (id%10 == 5) return 50;
	else if (id%10  < 5) return 10;
	else if (id%10  > 5) return 25;
}

TECHNO.Link = function(pos1,pos2) {
	var curve = THREE.Curve.create(function (o) { },
		function ( t ) { //getPoint: t is between 0-1

		var tx = pos1.x+(pos2.x-pos1.x)*t;
		var ty = pos1.y+(pos2.y-pos1.y)*t;
		var tz = pos1.z+(pos2.z-pos1.z)*t;

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( 1000 );
	});
	var geometry = new THREE.TubeGeometry( new curve, 10, 25, 16, false );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff , envMap: scene.background } );
	var mesh = new THREE.Mesh( geometry, material );
	TECHNO.add( mesh );
};

function C(r,g,b) {
	var red = r || Math.random()*255; 
	var gre = g || Math.random()*255; 
	var blu = b || Math.random()*255; 
	return new THREE.Color("rgb("+Math.round(red)+","+Math.round(gre)+","+Math.round(blu)+")");
}

TECHNO.init = function() {
	scene.add(TECHNO);
	TECHNO.node = [];
	TECHNO.over = [];

	var alight = new THREE.AmbientLight(0x888888);
	TECHNO.add(alight);

	TECHNO.animate = function(delta) {

		//var vectoref = new THREE.Vector3(0,1,0);
		//var camangle = vectoref.angleTo(camera.position);
		//if (camera.position.y>0){ maskSprite0.scale.setY(80); maskSprite1.scale.setY( 80*Math.cos(camangle)); BlackMesh1.visible = true; BlackMesh0.visible = false; }
		//else					{ maskSprite1.scale.setY(80); maskSprite0.scale.setY(-80*Math.cos(camangle)); BlackMesh0.visible = true; BlackMesh1.visible = false; }
		
		TECHNO.rotation.y -= 0.02*delta;
	};

	//techno.showlink = function(tid,flag) {
	//	GetStark(tid).showlink(flag);
	//}

	var focusMaterial = new THREE.SpriteMaterial( 
	{ 
		map: new THREE.ImageUtils.loadTexture( './img/focus.jpg',{}, function() { guisc.add(TECHNO.focusSprite); } ),
		//useScreenCoordinates: false,
		color: 0xffffff,
		transparent: false,
		blending: THREE.AdditiveBlending
	});
	TECHNO.focusSprite = new THREE.Sprite( focusMaterial );
	TECHNO.focusSprite.scale.set(256, 256, 1.0);
	TECHNO.focusSprite.position.setX(12);
	TECHNO.focusSprite.visible = false;


	// Star Skybox
	//var skyGeometry = new THREE.SphereBufferGeometry(200000, 32, 32);
	//var skyMaterial = new THREE.MeshBasicMaterial({
	//		map: THREE.ImageUtils.loadTexture( "img/starbox/skystar.jpg" ),
	//		color : 0xbbdddd,
	//		side: THREE.BackSide
	//	});
	//TECHNO.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	//TECHNO.add( TECHNO.skyBox );
	scene.background = new THREE.CubeTextureLoader()
					.setPath( 'img/starbox/' )
					.load( [ 's_px.jpg', 's_nx.jpg', 's_py.jpg', 's_ny.jpg', 's_pz.jpg', 's_nz.jpg' ] );

//	techno.old = function(delta) {
//
//		var time = Date.now() * 0.001;
//		sphere.rotation.z = 0.01 * time;
//
//		for( var i = 0; i < attributes.size.value.length; i++ ) {
//			attributes.size.value[ i ] = 20 + 10 * Math.sin( 0.1 * i + time );
//		}
//
//		attributes.size.needsUpdate = true;
//	}

	for (var i=0;i<TECHNO.data.length;i++) {
		TECHNO.node.push(new Node(TECHNO.data[i]));
	}
};

// =======================
// ===== TECH  CLASS =====
// =======================

function Tech(support,radius,hue,sat,lvl,tid) { if (tech_data[tid].lvl() != 0 || tid<10) {
	this.planet = new Stark(support,radius,hue,sat,"planet",tid);

	this.moon = [];
	for (var m=0;m<tech_data[tid].lvl();m++) {
		this.moon.push(new Stark(this.planet.starcore,50+5*m,hue,sat,"moon",lvl+1))
	}
	/*this.link = tech_link[tid];
	//console.log(JSON.stringify(this.link,null,4));
	for (var l=0;l<this.link.length;l++) {
		var target = GetStark(this.link[l]);
		this.link[l] = new TechLink(this.planet.starcore,target.hue,target.sat,target.tid);
	}*/

	this.animate = function(delta) {
		this.planet.animate(delta);
		for (var m=0;m<this.moon.length;m++) {
			this.moon[m].animate(delta);
		}/*
		for (var l=0;l<this.link.length;l++) {
			this.link[l].animate(delta);
		}*/
	}
}
else {
	var tag = "1-0-"+(tid%5)+"-"+(Math.floor(tid/5)+4);
	gui_data[tag].name = " ";
	gui_data[tag].cb = function(){};
	this.planet        = new THREE.Object3D();
	this.planet.object = new THREE.Object3D();
	this.animate = function(delta) {};
}}

// =======================
// MAIN GLOWING BODY CLASS
// =======================

function Stark(support,radius,hue,sat,type,tid) {
	switch(player_data.grph) {
		case 0 : var intb = 1.5; switch(type) {
			case "star"   : var size = 100; var particles =  250; var point = 200; break;
			case "planet" : var size =  25; var particles =   25; var point = 160; break;
			case "moon"   : var size =   5; var particles =    4; var point = 120; break;
		} break;
		case 1 : var intb = 1.0; switch(type) {
			case "star"   : var size = 100; var particles =  2500; var point = 120; break;
			case "planet" : var size =  25; var particles =   250; var point = 100; break;
			case "moon"   : var size =   5; var particles =    25; var point =  50; break;
		} break;
	}
	var speed = 600/(Math.sqrt(radius*radius*radius));
	var stark = new THREE.Object3D();
	this.object = stark;

	var geos = new THREE.SphereBufferGeometry(size, 32, 32);
	var mats = new THREE.MeshPhongMaterial();
	var starMesh = new THREE.Mesh(geos, mats);
		starMesh.tid = tid;
	stark.add(starMesh);

	var attributes = {
		size:        { type: 'f', value: null },
		customColor: { type: 'c', value: null }
	};

	var uniforms = {
		color:     { type: "c", value: new THREE.Color( 0xbbbbbb ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( './img/star.png' ) }
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		attributes:     attributes,
		vertexShader:   StarShader.vertexShader,
		fragmentShader: StarShader.fragmentShader,

		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true
	});

	var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array( particles * 3 );
	var values_color = new Float32Array( particles * 3 );
	var values_size = new Float32Array( particles );

	var color = new THREE.Color();//geometry. .length;

	for( var v = 0; v < particles; v++ ) {

		values_size[ v ] = point;

		var theta = Math.random()*Math.PI*2;
		var phi   = (Math.random()-Math.random()+Math.random()-Math.random()+Math.random()-Math.random())*Math.PI/3;
		positions[ v * 3 + 0 ] = ( Math.cos(theta)*Math.cos(phi) ) * size;
		positions[ v * 3 + 2 ] = ( Math.sin(theta)*Math.cos(phi) ) * size;
		positions[ v * 3 + 1 ] = ( Math.sin(phi) ) * size;

		color.setHSL( hue+random10k[v+1]*0.05, intb*sat, intb/10+random10k[v+2]*0.10 );

		values_color[ v * 3 + 0 ] = color.r;
		values_color[ v * 3 + 1 ] = color.g;
		values_color[ v * 3 + 2 ] = color.b;

	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'customColor', new THREE.BufferAttribute( values_color, 3 ) );
	geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

	this.starcore = new THREE.PointCloud( geometry, shaderMaterial );

	this.starcore.position.x = radius;
	starMesh.position.x = radius;

	starMesh.link = [];
	if(type=="moon") {
		stark.rotation.x = (Math.random()-0.5)*Math.PI;
		stark.rotation.y = (Math.random()-0.5)*Math.PI;
	} else if (tid<30) {
		starMesh.hue = hue;
		starMesh.sat = sat;
		starMesh.link = tech_link[tid];
		for (var l=0;l<starMesh.link.length;l++) {
			var target = GetStark(starMesh.link[l]);
			starMesh.link[l] = new TechLink(this.starcore,target.hue,target.sat,target.tid);
		}
		techno.over.push(starMesh);
	}

	stark.add( this.starcore );
	support.add(stark);
		

	var timeline = 0;
	//var perfhelp = 0;
	this.animate = function(delta) {

		stark.rotation.y += speed*delta;
		this.starcore.rotation.y -= speed*delta/2;

		timeline += 0.5*delta;
		//if (perfhelp == 4) {
			//geometry.getAttribute( 'size' );
			var tempsize = new Float32Array( particles );
			for( var i = 0; i < particles; i++ ) {
				//if (i==0) console.log(20 * ( 1 + Math.sin( 0.1 * i + timeline )));
				tempsize[ i ] = point * ( 1+random10k[i] + Math.sin( random10k[i]*10 + timeline ) );
			}
			geometry.attributes.size.set(tempsize);
			geometry.attributes.size.needsUpdate = true;
		//	perfhelp = 0;
		//} else {perfhelp++;}

		for (var l=0;l<starMesh.link.length;l++) {
			starMesh.link[l].animate(delta);
		}
	}

	this.init = function() {
		GetRemoteLink(starMesh.tid,starMesh.link);
		//console.log(starMesh.link.length);
	}

	starMesh.showlink = function(flag) {
	for (var l=0;l<starMesh.link.length;l++) {
		starMesh.link[l].object.visible = flag;
	}}
}

// =======================
// === ACCRETION DISC ====
// =======================

function BHDisc(support,hue,sat) {
	var speed = 600/(Math.sqrt(10)*10000);
	var bhdisc = new THREE.Object3D();
	this.object = bhdisc;

	var attributes = {
		size:        { type: 'f', value: null },
		customColor: { type: 'c', value: null }
	};

	var uniforms = {
		color:     { type: "c", value: new THREE.Color( 0xbbbbbb ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( './img/star.png' ) }
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		attributes:     attributes,
		vertexShader:   StarShader.vertexShader,
		fragmentShader: StarShader.fragmentShader,

		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true
	});

	var particles = 500;
	var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array( particles * 3 );
	var values_color = new Float32Array( particles * 3 );
	var values_size = new Float32Array( particles );

	var color = new THREE.Color();//geometry. .length;

	for( var v = 0; v < particles; v+=2 ) {

		values_size[ v ] = 250;

		positions[ v * 3 + 0 ] = datadisc.x[ v*2 ] + 0.04*v*(Math.random()+Math.random()+Math.random()+Math.random()-2);
		positions[ v * 3 + 2 ] = datadisc.z[ v*2 ] + 0.04*v*(Math.random()+Math.random()+Math.random()+Math.random()-2);
		positions[ v * 3 + 1 ] = 0;

		color.setHSL( hue+random10k[v*2+1]*0.05, sat, 0.05+random10k[v*2+2]*0.05 );

		values_color[ v * 3 + 0 ] = color.r;
		values_color[ v * 3 + 1 ] = color.g;
		values_color[ v * 3 + 2 ] = color.b;

	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'customColor', new THREE.BufferAttribute( values_color, 3 ) );
	geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

	this.starcore = new THREE.PointCloud( geometry, shaderMaterial );

	//this.starcore.position.x = radius;

	bhdisc.add( this.starcore );
	support.add(bhdisc);

	var timeline = 0;
	//var perfhelp = 0;
	var difstart = Math.random()*2*Math.PI;
	this.animate = function(delta) {

		bhdisc.rotation.y += speed*delta;
		//this.starcore.rotation.y -= speed*delta/2;

		timeline += 0.5*delta;
		//if (perfhelp == 4) {
			//geometry.getAttribute( 'size' );
			var tempsize = new Float32Array( particles );
			for( var i = 0; i < particles; i++ ) {
				//if (i==0) console.log(20 * ( 1 + Math.sin( 0.1 * i + timeline )));
				tempsize[ i ] = 120 * ( 1+random10k[i] + Math.sin( difstart + i/40 + timeline ) );
			}
			geometry.attributes.size.set(tempsize);
			geometry.attributes.size.needsUpdate = true;
		//	perfhelp = 0;
		//} else {perfhelp++;}
	}
}

// =======================
// ====== TECH LINKS =====
// =======================

function TechLink(support,hue,sat,tid) {
	var techlink = new THREE.Object3D();
	this.object = techlink;
	this.object.visible = false;
	this.tid = tid;

	var attributes = {
		size:        { type: 'f', value: null },
		customColor: { type: 'c', value: null }
	};

	var uniforms = {
		color:     { type: "c", value: new THREE.Color( 0xbbbbbb ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( './img/star.png' ) }
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		attributes:     attributes,
		vertexShader:   StarShader.vertexShader,
		fragmentShader: StarShader.fragmentShader,

		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true
	});

	if (player_data.grph>0) {
		var particles = 200;	var psize = 50;		var intb = 1.0;
	} else {
		var particles = 25;		var psize = 150;	var intb = 1.5;
	}
	var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array( particles * 3 );
	var values_color = new Float32Array( particles * 3 );
	var values_size = new Float32Array( particles );

	var color = new THREE.Color();//geometry. .length;

	for( var v = 0; v < particles; v++ ) {

		values_size[ v ] = psize;

		positions[ v * 3 + 0 ] = 0;
		positions[ v * 3 + 2 ] = 0;
		positions[ v * 3 + 1 ] = 0;

		color.setHSL( hue+random10k[v+1]*0.05, intb*sat, intb/10+random10k[v+2]*0.10 );

		values_color[ v * 3 + 0 ] = color.r;
		values_color[ v * 3 + 1 ] = color.g;
		values_color[ v * 3 + 2 ] = color.b;

	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'customColor', new THREE.BufferAttribute( values_color, 3 ) );
	geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

	this.starcore = new THREE.PointCloud( geometry, shaderMaterial );

	//this.starcore.position.x = radius;

	techlink.add( this.starcore );
	support.add(techlink);


	var timeline = 0;
	//var perfhelp = 0;
	var difstart = Math.random()*2*Math.PI;
	this.animate = function(delta) { if (this.object.visible) {

		techlink.rotation.y = -techlink.parent.rotation.y -techlink.parent.parent.rotation.y -techlink.parent.parent.parent.rotation.y -techlink.parent.parent.parent.parent.rotation.y;
		//if (spaming>0) {console.log(techlink.parent.rotation.y); spaming--;}

		timeline += 0.5*delta;//new THREE.Vector3(250,0,150);
		//if (perfhelp == 4) {
			var vec3link = scene.position.clone().setFromMatrixPosition( GetMatrix(this.tid) ).sub( scene.position.clone().setFromMatrixPosition( techlink.matrixWorld ) );
			//console.log(vec3link);
			var link = new Float32Array( particles * 3 );
			var tempsize = new Float32Array( particles );
			for( var i = 0; i < particles; i++ ) {
				link[i*3  ] = vec3link.x*i/particles;
				link[i*3+1] = vec3link.y*i/particles;
				link[i*3+2] = vec3link.z*i/particles;
				tempsize[ i ] = psize * ( 1+random10k[i] + Math.sin( difstart + i*5/particles + timeline ) );
			}
			geometry.attributes.position.set(link);
			geometry.attributes.position.needsUpdate = true;
			geometry.attributes.size.set(tempsize);
			geometry.attributes.size.needsUpdate = true;
		//	perfhelp = 0;
		//} else {perfhelp++;}
	}}
}

function GetStark(tid) {
	for (var i=0;i<techno.over.length;i++) {
		if (techno.over[i].tid == tid)
			return techno.over[i];
	}
	console.log("Error in stark finding !");
	return {"hue":0.3,"sat":0.1,"id":0};
}

function GetRemoteLink(tid,array) {
	for (var i=0;i<techno.over.length;i++) {
		if (techno.over[i].tid > 10 && techno.over[i].tid%5!=0) {
			if (techno.over[i].link[0].tid == tid) array.push(techno.over[i].link[0]);
			if (techno.over[i].link[1].tid == tid) array.push(techno.over[i].link[1]);
			if (techno.over[i].link[2].tid == tid) array.push(techno.over[i].link[2]);
		}
	}
}

function GetMatrix(tid) {
	for (var i=0;i<techno.over.length;i++) {
		if (techno.over[i].tid == tid)
			return techno.over[i].matrixWorld;
	}
	console.log("Error in matrix finding !");
	return new THREE.Object3D().matrixWorld;
}


TECHNO.data = [
	  {	id:0,	x:1,	y:0,	z:0,
	  	name: 'BasicArmor',
	  	link: [10,20,40,50, 1, 2, 3, 4]
	},{	id:1,	x:1.7,	y:0.7,	z:0.7,
	  	name: 'PlatedConductor',
	  	link: [ 0, 5, 2, 4,14,22]
	},{	id:2,	x:1.7,	y:0.7,	z:-0.7,
	  	name: 'EmptyStructure',
	  	link: [ 0, 5, 1, 3,13,54]
	},{	id:3,	x:1.7,	y:-0.7,	z:-0.7,
	  	name: 'CargoContainer',
	  	link: [ 0, 5, 2, 4,41,51]
	},{	id:4,	x:1.7,	y:-0.7,	z:0.7,
	  	name: 'PlatedHeatPipe',
	  	link: [ 0, 5, 1, 3,23,42]
	},{	id:5,	x:2.4,	y:0,	z:0,
	  	name: 'HybridArmor',
	  	link: [ 1, 2, 3, 4, 6, 7, 8, 9]
	},{	id:6,	x:2.4,	y:0,	z:1,
	  	name: 'Regenerative',
	  	link: [ 5, 7, 9,28]
	},{	id:7,	x:2.4,	y:1,	z:0,
	  	name: 'LightArmor',
	  	link: [ 5, 6, 8,16]
	},{	id:8,	x:2.4,	y:0,	z:-1,
	  	name: 'Isolator',
	  	link: [ 5, 7, 9,56]
	},{	id:9,	x:2.4,	y:-1,	z:0,
	  	name: 'HeavyArmor',
	  	link: [ 5, 8, 6,47]
	},{ id:10,	x:0,	y:1,	z:0,
	  	name: 'BasicThruster',
	  	link: [ 0,20,30,50,11,12,13,14]
	},{	id:11,	x:-0.7,	y:1.7,	z:0.7,
	  	name: 'PlasmaEngine',
	  	link: [10,15,12,14,21,33]
	},{	id:12,	x:-0.7,	y:1.7,	z:-0.7,
	  	name: '',
	  	link: [10,15,11,13,34,53]
	},{	id:13,	x:0.7,	y:1.7,	z:-0.7,
	  	name: '',
	  	link: [10,15,12,14, 2,54]
	},{	id:14,	x:0.7,	y:1.7,	z:0.7,
	  	name: 'IonEngine',
	  	link: [10,15,11,13, 1,22]
	},{	id:15,	x:0,	y:2.4,	z:0,
	  	name: 'AdvancedThruster',
	  	link: [11,12,13,14,16,17,18,19]
	},{	id:16,	x:0,	y:2.4,	z:1,
	  	name: 'WarpGenerator',
	  	link: [15,17,19,27]
	},{	id:17,	x:-1,	y:2.4,	z:0,
	  	name: '',
	  	link: [15,16,18,39]
	},{	id:18,	x:0,	y:2.4,	z:-1,
	  	name: '',
	  	link: [15,17,19,59]
	},{	id:19,	x:1,	y:2.4,	z:0,
	  	name: 'OrionUnit',
	  	link: [15,18,16, 7]
	},{ id:20,	x:0,	y:0,	z:1,
	  	name: 'PowerCore',
	  	link: [ 0,10,30,40,21,22,23,24]
	},{	id:21,	x:-0.7,	y:0.7,	z:1.7,
	  	name: 'Boosted',
	  	link: [20,25,22,24,11,33]
	},{	id:22,	x:0.7,	y:0.7,	z:1.7,
	  	name: 'Conductor',
	  	link: [20,25,21,23, 1,14]
	},{	id:23,	x:0.7,	y:-0.7,	z:1.7,
	  	name: 'HeatPipe',
	  	link: [20,25,22,24, 4,42]
	},{	id:24,	x:-0.7,	y:-0.7,	z:1.7,
	  	name: 'Battery',
	  	link: [20,25,21,23,32,43]
	},{	id:25,	x:0,	y:0,	z:2.4,
	  	name: 'OmniRole',
	  	link: [21,22,23,24,26,27,28,29]
	},{	id:26,	x:-1,	y:0,	z:2.4,
	  	name: 'FuelCell',
	  	link: [25,27,29,38]
	},{	id:27,	x:0,	y:1,	z:2.4,
	  	name: 'EndLess',
	  	link: [25,26,28,16]
	},{	id:28,	x:1,	y:0,	z:2.4,
	  	name: 'FluidEjector',
	  	link: [25,27,29, 6]
	},{	id:29,	x:0,	y:-1,	z:2.4,
	  	name: 'OverLoaded',
	  	link: [25,28,26,48]
	},{ id:30,	x:-1,	y:0,	z:0,
	  	name: 'MiningTurret',
	  	link: [10,20,40,50,31,32,33,34]
	},{	id:31,	x:-1.7,	y:-0.7,	z:-0.7,
	  	name: 'FlakBattery',
	  	link: [30,35,32,34,44,52]
	},{	id:32,	x:-1.7,	y:-0.7,	z:0.7,
	  	name: 'PulseLaser',
	  	link: [30,35,31,33,43,24]
	},{	id:33,	x:-1.7,	y:0.7,	z:0.7,
	  	name: 'RailGun',
	  	link: [30,35,32,34,11,21]
	},{	id:34,	x:-1.7,	y:0.7,	z:-0.7,
	  	name: 'EMPMines',
	  	link: [30,35,31,33,53,12]
	},{	id:35,	x:-2.4,	y:0,	z:0,
	  	name: 'MissileLauncher',
	  	link: [31,32,33,34,36,37,38,39]
	},{	id:36,	x:-2.4,	y:0,	z:-1,
	  	name: '',
	  	link: [35,37,39,58]
	},{	id:37,	x:-2.4,	y:-1,	z:0,
	  	name: '',
	  	link: [35,36,38,46]
	},{	id:38,	x:-2.4,	y:0,	z:1,
	  	name: 'Plasma',
	  	link: [35,37,39,26]
	},{	id:39,	x:-2.4,	y:1,	z:0,
	  	name: 'MassDriver',
	  	link: [35,38,36,17]
	},{ id:40,	x:0,	y:-1,	z:0,
	  	name: 'ReactionWeel',
	  	link: [ 0,20,30,50,41,42,43,44]
	},{	id:41,	x:0.7,	y:-1.7,	z:-0.7,
	  	name: 'ReflectiveCoating',
	  	link: [40,45,42,44,51, 3]
	},{	id:42,	x:0.7,	y:-1.7,	z:0.7,
	  	name: 'MagneticBalls',
	  	link: [40,45,41,43, 4,23]
	},{	id:43,	x:-0.7,	y:-1.7,	z:0.7,
	  	name: 'EnergyFlare',
	  	link: [40,45,42,44,32,24]
	},{	id:44,	x:-0.7,	y:-1.7,	z:-0.7,
	  	name: 'OverlayCircuits',
	  	link: [40,45,41,43,31,52]
	},{	id:45,	x:0,	y:-2.4,	z:0,
	  	name: 'MassMover',
	  	link: [41,42,43,44,46,47,48,49]
	},{	id:46,	x:0,	y:-2.4,	z:-1,
	  	name: 'ScanArray',
	  	link: [45,47,49,57]
	},{	id:47,	x:1,	y:-2.4,	z:0,
	  	name: 'Hook',
	  	link: [45,46,48, 9]
	},{	id:48,	x:0,	y:-2.4,	z:1,
	  	name: 'MultispectralBeam',
	  	link: [45,47,49,29]
	},{	id:49,	x:-1,	y:-2.4,	z:0,
	  	name: 'BombLauncher',
	  	link: [45,48,46,37]
	},{ id:50,	x:0,	y:-0,	z:-1,
	  	name: 'DroneLauncher',
	  	link: [ 0,10,30,40,51,52,53,54]
	},{	id:51,	x:0.7,	y:-0.7,	z:-1.7,
	  	name: 'Sentry',
	  	link: [50,55,52,54,41, 3]
	},{	id:52,	x:-0.7,	y:-0.7,	z:-1.7,
	  	name: 'Defender',
	  	link: [50,55,51,53,31,44]
	},{	id:53,	x:-0.7,	y:0.7,	z:-1.7,
	  	name: 'Interceptor',
	  	link: [50,55,52,54,34,12]
	},{	id:54,	x:0.7,	y:0.7,	z:-1.7,
	  	name: 'ECMDrones',
	  	link: [50,55,51,53, 2,13]
	},{	id:55,	x:0,	y:0,	z:-2.4,
	  	name: 'FighterUnit',
	  	link: [51,52,53,54,56,57,58,59]
	},{	id:56,	x:1,	y:0,	z:-2.4,
	  	name: 'Insider',
	  	link: [55,57,59, 8]
	},{	id:57,	x:0,	y:-1,	z:-2.4,
	  	name: 'FighterBomber',
	  	link: [55,56,58,46]
	},{	id:58,	x:-1,	y:0,	z:-2.4,
	  	name: 'CriticalFighter',
	  	link: [55,57,59,36]
	},{	id:59,	x:0,	y:1,	z:-2.4,
	  	name: 'SuperiorFighter',
	  	link: [55,58,56,18]
	}
];

//spaming = 1000;
