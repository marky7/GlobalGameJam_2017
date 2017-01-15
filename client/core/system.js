var system = new THREE.Object3D();
	system.rotate = function() {};
var icons = new THREE.Object3D();
var systemtracking = -1;

function ShowSystem() { if (!system.visible) {
	console.log("trigger !");
	HideAll();
	system.visible = true;
	controls.minDistance =  0.1;
	controls.maxDistance = 256000;
	controls.userPan = true;
	controls.userPanSpeed = 0.02;
	console.log(JSON.stringify(active_stars,null,4));
	//console.log(JSON.stringify(active_planet,null,4));
	MakeSystem();
	camera.position.set(0,100,200);
    controls.center.set(0,0,0); 
    controls.traveling(new THREE.Vector3(),64000);
}}

function InitSystem() {
	scene.add(system);	
}

var TsunTexture = THREE.ImageUtils.loadTexture( "./img/star/sunsurface.png" );
	//sunTexture.anisotropy = renderer.getMaxAnisotropy();
	TsunTexture.wrapS = TsunTexture.wrapT = THREE.RepeatWrapping;
var TsunColorLookupTexture = THREE.ImageUtils.loadTexture( "./img/star/starcolorshift.png" );
var TstarColorGraph = THREE.ImageUtils.loadTexture( "./img/star/starcolorspectral.png" );
var TsunCoronaTexture = THREE.ImageUtils.loadTexture( "./img/star/corona.png" );
var TsunHaloTexture = THREE.ImageUtils.loadTexture( "/img/star/sunhalo.png" );
var TsunHaloColorTexture = THREE.ImageUtils.loadTexture( "/img/star/halocolorshift.png" );

//M solar mass x G -> 1.3275*Math.pow(10,20)*M
//1/AU^3 -> 2.9630*Math.pow(10,-34)
// = 3.9334*Math.pow(10,-14)
// sec to day -> x 86400²
// = 0.00029343
var systemscale = 1;
function MakeSystem() {
	for( var i = system.children.length-1;i>=0;i--) {
		var obj = system.children[i]; system.remove(obj);
	}
	system.elem = [];
	system.apiv = [];
	system.icon = [];
	for (var s=0;s<active_stars.length;s++) {
		var iscore = false;
		var coreid = 0;
		for (var c=0;c<system.elem.length;c++) {
			if (active_stars[s].core == system.elem[c].core) {
				coreid = c; iscore = true; break; }
		}
		if (iscore) {
			system.elem[coreid].multi = true;
			system.elem[coreid].mass += active_stars[s].mass;
			system.elem[coreid].radius += active_stars[s].radius*active_stars[s].mass;
		}
		else {
			system.elem.push({"core"  : active_stars[s].core
							 ,"mass"  : active_stars[s].mass
							 ,"radius": active_stars[s].radius*active_stars[s].mass
							 ,"multi" : false
							 ,"anchor": null});
		}
	}	
	//Scale ajust (cam)
	var maxrad = 0;
	for (var s=0;s<active_stars.length;s++) {
		var currad = active_stars[s].radius;
		if (currad>maxrad)
			maxrad = currad;
	}
	for (var p=0;p<active_planet.length;p++) {
		var currad = active_planet[p].radius;
		if (currad>maxrad)
			maxrad = currad;
	}
	systemscale = 64000/maxrad;
	var lmaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
	for (var c=0;c<system.elem.length;c++) {
		if (c==0) {
			system.elem[c].radius = 0;
			//Anchor
			var anchor = new THREE.Object3D();
			system.elem[c].anchor = anchor;
			system.add(anchor);	
		} else {
			system.elem[c].radius /= system.elem[c].mass;
			//Pivot
			var pivot = new THREE.Object3D();
				pivot.speed = Math.sqrt(0.00029343*(system.elem[c].mass+system.elem[0].mass)/system.elem[c].radius/system.elem[c].radius/system.elem[c].radius);
			system.apiv.push(pivot);
			system.add(pivot);	
			//Anchor
			var anchor = new THREE.Object3D();
				anchor.position.x = system.elem[c].radius*systemscale;
			system.elem[c].anchor = anchor;
			pivot.add(anchor);	

			var lgeometry = new THREE.Geometry();
			for (var i=0;i<128;i++) {
				lgeometry.vertices.push(new THREE.Vector3( system.elem[c].radius*systemscale*Math.cos(i/64*Math.PI), 0, system.elem[c].radius*systemscale*Math.sin(i/64*Math.PI) ));
			}
			lgeometry.vertices.push(new THREE.Vector3( system.elem[c].radius*systemscale, 0, 0 ));
			var line = new THREE.Line( lgeometry, lmaterial, THREE.LineSegments);
				line.exp = true;
			pivot.add( line );	
		}

	}
	//TOREMOVE LOCATOR
	var sunMaterial = new THREE.SpriteMaterial( 
	{ 
		map: new THREE.ImageUtils.loadTexture( './img/star.png' ),
		useScreenCoordinates: false, 
		color: 0xffddbb,
		transparent: false,
		blending: THREE.AdditiveBlending
	});
	//STAR MAKING
	for (var s=0;s<active_stars.length;s++) {
		var coreid = 0;
		for (var c=0;c<system.elem.length;c++) {
			if (active_stars[s].core == system.elem[c].core) {
				coreid = c; break; }
		}
		if (s==0) {
			//Anchor
			var anchor = new THREE.Object3D();
			system.elem[0].anchor.add(anchor);
		} else {
			if (system.elem[coreid].multi || coreid==0) {
				var orbit = active_stars[s].radius-system.elem[coreid].radius;//+active_stars[0].size/150000000
				//Pivot
				var pivot = new THREE.Object3D();
					pivot.speed = Math.sqrt(0.00029343*system.elem[coreid].mass/orbit/orbit/Math.abs(orbit));
				//system.apiv.push(pivot);
				system.elem[coreid].anchor.add(pivot)
				//Anchor
				var anchor = new THREE.Object3D();
					anchor.position.x = orbit*systemscale;
					//if (coreid==0) anchor.position.x *= 25;
				pivot.add(anchor);
				if (system.elem[coreid].multi) {	
					var coredist = Math.abs(system.elem[coreid].radius-active_stars[s].radius)
					if (coredist > system.elem[coreid].multi) system.elem[coreid].multi = coredist;
				}	
				var lgeometry = new THREE.Geometry();
				for (var i=0;i<128;i++) {
					lgeometry.vertices.push(new THREE.Vector3( orbit*Math.cos(i/64*Math.PI)*systemscale, 0, orbit*Math.sin(i/64*Math.PI)*systemscale ));
				}
				lgeometry.vertices.push(new THREE.Vector3( orbit*systemscale, 0, 0 ));
				var line = new THREE.Line( lgeometry, lmaterial, THREE.LineSegments);
					line.exp = true;
				//system.elem[coreid].anchor.add( line );
				pivot.add( line );
			}
			else {

				//Anchor
				var anchor = new THREE.Object3D();
				system.elem[coreid].anchor.add(anchor)
			}
		}
		//STAR
		var newstar = NewGenStar(active_stars[s].size/150000000*systemscale,active_stars[s].type%1024/512-0.128);
			active_stars[s].object = newstar;
			//starMesh.position.x = (active_stars[s].radius + active_stars[s].core)*1000;
		anchor.add(newstar);
		anchor.iconid = 1;
		system.icon.push({"id":active_stars[s].id+1,"txt":0,"ver":0  });
	}
	//PLANET MAKER
	for (var p=0;p<active_planet.length;p++) {
		var coreid = 0;
		for (var c=0;c<system.elem.length;c++) {
			if (active_planet[p].core == system.elem[c].core) {
				coreid = c; break; }
		}

		//Pivot
		var pivot = new THREE.Object3D();
			//console.log(.toString());pivot.name = "HERE/!\\";
			if (system.elem[coreid].multi) active_planet[p].radius += system.elem[coreid].multi*1.25;
			pivot.speed = Math.sqrt(0.00029343*(system.elem[coreid].mass+active_planet[p].mass)/active_planet[p].radius/active_planet[p].radius/active_planet[p].radius);
	
		system.elem[coreid].anchor.add(pivot);
		//Anchor
		var anchor = new THREE.Object3D();
			anchor.iconid = active_planet[p].core<10?2:3;
			anchor.position.x = active_planet[p].radius*systemscale;
		pivot.add(anchor);	

		system.elem.push({"core"  : active_planet[p].ref
				 		 ,"mass"  : active_planet[p].mass
				 		 ,"radius": active_planet[p].radius
				 		 ,"anchor": anchor});

		//PLANET
		var geop = new THREE.SphereBufferGeometry(active_planet[p].size/15000000*systemscale, 32, 32);//0000000

			matp= new THREE.MeshPhongMaterial();
			matp.map       	 = THREE.ImageUtils.loadTexture('./img/planetmin/'+active_planet[p].ptype+'d.jpg');
			//matp.normalMap   = THREE.ImageUtils.loadTexture('./img/planet/Alien-n.png');
			//matp.normalScale = 0;
			//matp.bumpMap   	= THREE.ImageUtils.loadTexture('./img/planet/'+active_planet[p].ptype+'N.jpg');
			//matp.bumpScale 	= 0.00001;
			//matp.specularMap= THREE.ImageUtils.loadTexture('./img/planet/'+active_planet[p].ptype+'N.jpg');
			//matp.specular  	= new THREE.Color(0x2f2f2f);

		var planetMesh = new THREE.Mesh(geop, matp);
			//planetMesh.position.x = active_planet[p].radius;
		anchor.add(planetMesh);
		//anchor.updateMatrixWorld();
		if (active_planet[p].core<10) system.icon.push({"id":active_planet[p].id,"txt":1,"ver":0 });
		else 						  system.icon.push({"id":active_planet[p].id,"txt":2,"ver":0 });
		/*/var sunSprite = new THREE.Sprite( sunMaterial );
		sunSprite.scale.set(1,1,1);
		anchor.add(sunSprite);//*/

		var lgeometry = new THREE.Geometry();
		for (var i=0;i<128;i++) {
			lgeometry.vertices.push(new THREE.Vector3( active_planet[p].radius*Math.cos(i/64*Math.PI)*systemscale, 0, active_planet[p].radius*Math.sin(i/64*Math.PI)*systemscale ));
		}
		lgeometry.vertices.push(new THREE.Vector3( active_planet[p].radius*systemscale, 0, 0 ));
		var line = new THREE.Line( lgeometry, lmaterial, THREE.LineSegments);
			line.exp = true;
		pivot.add( line );
		//system.elem[coreid].anchor.add( line );	

		/*if (active_planet[p].core>9) {
			var xgeometry = new THREE.Geometry();
			for (var i=0;i<128;i++) {
				xgeometry.vertices.push(new THREE.Vector3( 0.2*Math.cos(i/64*Math.PI), 0, 0.2*Math.sin(i/64*Math.PI) ));
			}
			xgeometry.vertices.push(new THREE.Vector3( 0.2, 0, 0 ));
			var xline = new THREE.Line( xgeometry, lmaterial, THREE.LineSegments);
				xline.rotation.z = Math.PI/2;
			anchor.add( xline );
		}*/
	}
	/*for (var i=0;i<system.elem.length;i++) {
		console.log(system.elem[i].core+'-'+system.elem[i].radius);
	}
	console.log(JSON.stringify(active_planet,null,4));*/
	//pointlight
	var slight = new THREE.PointLight(0xdddddd);
		slight.position.y = 100000; // UP TEMP LIGHT
		slight.position.z =  50000; // UP TEMP LIGHT
	system.add(slight)
	var alight = new THREE.AmbientLight(0x222222);
	system.add(alight);

	//DONT TUCH
	/*var hangartext = new THREE.Texture();
	var loader2 = new THREE.ImageLoader();
	loader2.load( 'obj/hangar.png', function ( image ) {
		hangartext.image = image;
		hangartext.needsUpdate = true;
	} );

	var hangar = new THREE.OBJMTLLoader();
	hangar.load( 'obj/hangar.obj','obj/hangar.mtl', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = hangartext;
			}
		} );
		//object.position.y = 1*systemscale;
		system.add( object );
	});*/

	//Hangar
	var ship;
	var loader = new THREE.OBJLoader();
	loader.load( '100', function ( object ) {
		//object.traverse( function ( child ) {
		//	if ( child instanceof THREE.Mesh ) {
		//		child.material.map = shiptext;
		//	}
		//} );
		//object.position.y = 0.1*systemscale;
		system.add( object );
	});//*/
	//SHIP
	var loader2 = new THREE.OBJLoader();
	loader2.load( '0', function ( object ) {
		//object.traverse( function ( child ) {
		//	if ( child instanceof THREE.Mesh ) {
		//		child.material.map = shiptext;
		//	}
		//} );
		ship = object;
		system.add( object );
	});//*/

	//System Cursor
	var cursortxt = THREE.ImageUtils.loadTexture( './img/focus2.jpg' );
    var cursormat = new THREE.SpriteMaterial( { map: cursortxt, color: 0xffffff, blending: THREE.AdditiveBlending } );
    var cursorobj = new THREE.Sprite( cursormat );
    	cursorobj.visible = false;
    	cursorobj.scale.set(8, 8, 1.0);
    system.cursor = cursorobj;
    system.add( cursorobj );

	// Star Skybox
	var skyGeometry = new THREE.SphereBufferGeometry(500000, 32, 32);
	var skyMaterial = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( "img/starbox/skystar.jpg" ),
			color : 0xbbdddd,
			side: THREE.BackSide
		});
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	system.add( skyBox );	//*/

	//console.log(system.apiv);
	system.attributes = {
		size:      { type: 'f', value: null },
		texture:   { type: "f", value: null }
	};	
	system.uniforms = {
		color:   { type: "c", value: new THREE.Color( 0xffffff ) },
		text0:   { type: "t", value: THREE.ImageUtils.loadTexture( './img/iconstar.png' ) },
		text1:   { type: "t", value: THREE.ImageUtils.loadTexture( './img/iconplan.png' ) },
		text2:   { type: "t", value: THREE.ImageUtils.loadTexture( './img/iconmoon.png' ) }
	};	
	system.shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       system.uniforms,
		attributes:     system.attributes,
		vertexShader:   IconShader.vertexShader,
		fragmentShader: IconShader.fragmentShader,

		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true
	});
	var bodies = system.icon.length;
	system.geometry = new THREE.BufferGeometry();
	var positions = new Float32Array( bodies*3 );
	var values_text = new Float32Array( bodies );
	var values_size = new Float32Array( bodies );
	var values_id = new Float32Array( bodies );
	var v=0;

	for (var c=0;c<system.children.length;c++) {
		var c1 = system.children[c]; 
		if (c1.iconid) { c1.ver=v; values_text[v]=c1.iconid-1; v++; }
		for (var d=0;d<c1.children.length;d++) {
			var c2 = c1.children[d]; 
			if (c2.iconid) { c2.ver=v; values_text[v]=c2.iconid-1; v++; }
			for (var e=0;e<c2.children.length;e++) {
				var c3 = c2.children[e]; 
				if (c3.iconid) { c3.ver=v; values_text[v]=c3.iconid-1; v++; }
				for (var f=0;f<c3.children.length;f++) {
					var c4 = c3.children[f]; 
					if (c4.iconid) { c4.ver=v; values_text[v]=c4.iconid-1; v++; }
					for (var g=0;g<c4.children.length;g++) {
						var c5 = c4.children[g]; 
						if (c5.iconid) { c5.ver=v; values_text[v]=c5.iconid-1; v++; }
						for (var h=0;h<c5.children.length;h++) {
							var c6 = c5.children[h]; 
							if (c6.iconid) { c6.ver=v; values_text[v]=c6.iconid-1; v++; }
						}
					}
				}
			}
		}
	}
	if (v!=bodies) console.log("CRITICAL LENGTH ERROR");
	for (var v=0;v<bodies;v++) {
		positions[v*3] = 0; positions[v*3+1] = 0; positions[v*3+2] = 0;
		values_size[v] = 16; values_id[v] = v;
	}
	system.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	system.geometry.addAttribute( 'texture', new THREE.BufferAttribute( values_text, 1 ) );
	system.geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );
	system.geometry.addAttribute( 'galaxyid', new THREE.BufferAttribute( values_id, 1 ) );
		icons = new THREE.PointCloud( system.geometry, system.shaderMaterial );
		icons.frustumCulled = false;
	system.add(icons);

    var accutime = 0;
	system.rotate = function(delta) {
		//var NOW2=COUNTER.sprite*16/1000+10000000000;
		if (ship!=undefined) ship.rotation.y += delta/5;
		//Shader processing
		//var offset = camera.position.clone()/*.sub(camera.center)*/;Math.atan2( offset.x, offset.z );// + rotateYAccumulate
		accutime += delta;
		for (var s=0;s<active_stars.length;s++) {
			active_stars[s].object.update(accutime);
		}
		Now();
    	//Global rotation system
    	var particles = system.icon.length;
		var newpos = new Float32Array( particles*3 );
		var v=0;
		for (var c=0;c<system.children.length;c++) {
			var c1 = system.children[c]; var d1 = 0;
			if (c1.speed) {d1 = 0.0727*NOWS*c1.speed; c1.rotation.y = d1; } //c1.updateMatrix();
			if (c1.iconid) { var posc= new THREE.Vector3(); posc.setFromMatrixPosition(c1.matrixWorld); newpos[c1.ver*3]=posc.x; newpos[c1.ver*3+1]=0; newpos[c1.ver*3+2]=posc.z; 
				if (systemtracking==v) { controls.track(posc); } v++; }
			for (var d=0;d<c1.children.length;d++) {
				var c2 = c1.children[d]; var d2 = 0;
				if (!c2.exp) c2.rotation.y = -d1;
				if (c2.speed) {d2 = 0.0727*NOWS*c2.speed; c2.rotation.y = d2; } //c2.updateMatrix();
				if (c2.iconid) { var posc= new THREE.Vector3(); posc.setFromMatrixPosition(c2.matrixWorld); newpos[c2.ver*3]=posc.x; newpos[c2.ver*3+1]=0; newpos[c2.ver*3+2]=posc.z; 
					if (systemtracking==v) { controls.track(posc); } v++; }
				for (var e=0;e<c2.children.length;e++) {
					var c3 = c2.children[e]; var d3 = 0; 
					if (!c3.exp) c3.rotation.y = -d2;
					if (c3.speed) {d3 = 0.0727*NOWS*c3.speed; c3.rotation.y = -d3; } //c3.updateMatrix();
					if (c3.iconid) { var posc= new THREE.Vector3(); posc.setFromMatrixPosition(c3.matrixWorld); newpos[c3.ver*3]=posc.x; newpos[c3.ver*3+1]=0; newpos[c3.ver*3+2]=posc.z; 
						if (systemtracking==v) { controls.track(posc); } v++; }
					for (var f=0;f<c3.children.length;f++) {
						var c4 = c3.children[f]; var d4 = 0; 
						if (!c4.exp) c4.rotation.y = d3;
						if (c4.speed) {d4 = 0.0727*NOWS*c4.speed; c4.rotation.y = -d4; } //c4.updateMatrix();
						if (c4.iconid) { var posc= new THREE.Vector3(); posc.setFromMatrixPosition(c4.matrixWorld); newpos[c4.ver*3]=posc.x; newpos[c4.ver*3+1]=0; newpos[c4.ver*3+2]=posc.z; 
							if (systemtracking==v) { controls.track(posc); } v++; }
						for (var g=0;g<c4.children.length;g++) {
							var c5 = c4.children[g]; //var d5 = 0;
							if (!c5.exp) c5.rotation.y = d4;
							//if (c5.speed) {c5.rotation.y += 0.0727*NOWS*c5.speed; } //c5.updateMatrix();
							if (c5.iconid) { var posc= new THREE.Vector3(); posc.setFromMatrixPosition(c5.matrixWorld); newpos[c5.ver*3]=posc.x; newpos[c5.ver*3+1]=0; newpos[c5.ver*3+2]=posc.z; 
								if (systemtracking==v) { controls.track(posc); } v++; }
							for (var h=0;h<c5.children.length;h++) {
								var c6 = c5.children[h]; 
								//if (c6.speed) {c6.rotation.y += 0.0727*delta*c6.speed*1000; }
								if (c6.iconid) { var posc= new THREE.Vector3(); posc.setFromMatrixPosition(c6.matrixWorld); newpos[c6.ver*3]=posc.x; newpos[c6.ver*3+1]=0; newpos[c6.ver*3+2]=posc.z; 
									if (systemtracking==v) { controls.track(posc); } v++; }
							}
						}
					}
				}
			}
		}
		system.geometry.removeAttribute( 'position' );
		system.geometry.addAttribute( 'position', new THREE.BufferAttribute( newpos, 3 ) );
		//system.geometry.attributes.position.needsUpdate = true;
		//if (onlyonce>0) {console.log(system.geometry.getAttribute('position')); onlyonce--;}
		/*/Icons

		for (var v = 0; v < particles; v++ ) {
			var posreal = system.icon[v].pos.clone()
				//posreal.applyMatrix4( system.icon[v].matrix );
			newpos[ v*3 ] = posreal.x;
			newpos[v*3+1] = 0;
			newpos[v*3+2] = posreal.z;
		} 
		system.geometry.attributes.size.needsUpdate = true;		
		//skyBox.rotation.y -= 0.0727*delta;*/
	}
}

function UpdateIcon(id,vertice) {
	if (id<10) id--;
	for (var i=0;i<system.icon.length;i++) {

	}
}

function NewGenStar(size,spectral) {
	var newgenstar =  new THREE.Object3D();
		newgenstar.rotationAutoUpdate = false;
	var sunUniforms = {
		texturePrimary:   { type: "t", value: TsunTexture },
		textureColor:   { type: "t", value: TsunColorLookupTexture },
		textureSpectral: { type: "t", value: TstarColorGraph },
		time: 			{ type: "f", value: 0 },
		spectralLookup: { type: "f", value: 0 }		
	};
	var haloUniforms = {
		texturePrimary:   { type: "t", value: TsunHaloTexture },
		textureColor:   { type: "t", value: TsunHaloColorTexture },
		time: 			{ type: "f", value: 0 },
		textureSpectral: { type: "t", value: TstarColorGraph },
		spectralLookup: { type: "f", value: 0 }			
	};
	var coronaUniforms = {
		texturePrimary:   { type: "t", value: TsunCoronaTexture },
		textureSpectral: { type: "t", value: TstarColorGraph },
		spectralLookup: { type: "f", value: 0 }			
	};
	function map(v, i1, i2, o1, o2) {
		return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}
	var starColor = map( spectral, -0.3, 1.52, 0, 1);	//0.656
		starColor = Math.min(Math.max(starColor, 0.0), 1.0);
		sunUniforms.spectralLookup.value = starColor;
		haloUniforms.spectralLookup.value = starColor;	
		coronaUniforms.spectralLookup.value = starColor;
	var surfaceGeo = new THREE.SphereBufferGeometry( size, 32, 32);//7.35144e-8
	var sunShaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		sunUniforms,
		vertexShader:   StarSurface.vertexShader,
		fragmentShader: StarSurface.fragmentShader
	});
	var sunSphere = new THREE.Mesh( surfaceGeo, sunShaderMaterial);
	newgenstar.add(sunSphere);
	
	var haloGeo = new THREE.PlaneGeometry( size*3.2, size*3.2 );
	var sunHaloMaterial = new THREE.ShaderMaterial(
		{
			uniforms: 		haloUniforms,
			vertexShader:   StarHalo.vertexShader,
			fragmentShader: StarHalo.fragmentShader,
			blending: THREE.AdditiveBlending,
			depthTest: 		false,
			depthWrite: 	false,
			color: 0xffffff,
			transparent: true,
			//	settings that prevent z fighting
			polygonOffset: true,
			polygonOffsetFactor: 1,
			polygonOffsetUnits: 100
		}
	);
	var sunHalo = new THREE.Mesh( haloGeo, sunHaloMaterial );
		sunHalo.position.set( 0, 0, 0 );


	//	the bright glow surrounding everything
	var glowGeo = new THREE.PlaneGeometry( size*18, size*18 );
	var sunGlowMaterial = new THREE.ShaderMaterial(
		{
			//map: sunCoronaTexture,
			uniforms: 		coronaUniforms,
			vertexShader: 	StarCorona.vertexShader,
			fragmentShader: StarCorona.fragmentShader,
			blending: THREE.AdditiveBlending,
			color: 0xffffff,
			transparent: true,
			//	settings that prevent z fighting
			polygonOffset: true,
			polygonOffsetFactor: -1,
			polygonOffsetUnits: 100,
			depthTest: true,
			depthWrite: true
		}
	);
	var sunGlow = new THREE.Mesh( glowGeo, sunGlowMaterial );
		sunGlow.position.set( 0, 0, 0 );

	var gyro = new THREE.Object3D();
	newgenstar.add( gyro );	

	//	the corona that lines the edge of the sun sphere
    // console.time("make sun halo");
		gyro.add( sunHalo );
    // console.timeEnd("make sun halo");
	
    // console.time("make sun glow");
		gyro.add( sunGlow );
    // console.timeEnd("make sun glow");
    newgenstar.update = function(time) {
		sunUniforms.time.value = time;
		haloUniforms.time.value = time + camera.accuY*5;
		//lookAtAndOrient(gyro, new THREE.Vector3(), camera);//failed
		//gyro.lookAt ( camera.position.clone() ); //noneedit
		//var globalrot = newgenstar.localToWorld( newgenstar.rotation.clone() );
		//console.log(globalrot);
    }

    return newgenstar;
}

// =======================
// ===== TECH  CLASS =====
// =======================
/*
function Tech(support,radius,hue,sat,lvl,tid) { if (tech_data[tid].lvl() != 0 || tid<10) {
	this.planet = new Stark(support,radius,hue,sat,"planet",tid);

	this.moon = [];
	for (var m=0;m<tech_data[tid].lvl();m++) {
		this.moon.push(new Stark(this.planet.starcore,50+5*m,hue,sat,"moon",lvl+1))
	}

	this.animate = function(delta) {
		this.planet.animate(delta);
		for (var m=0;m<this.moon.length;m++) {
			this.moon[m].animate(delta);
		}
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
*/