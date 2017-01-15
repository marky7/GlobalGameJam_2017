var sector_div = 0;
var sector_exn = 2;
var sub_height = 1;
var sub_div = 3;
var sub_exn = 1;
function InitLocation() {/*
	var tempquad = base_data[base_sel].quad/16384;
	var tempradi = base_data[base_sel].radi/16384;
	var temphigh = base_data[base_sel].high/16384;
	sector_div = Math.floor(tempquad*24);
	sector_exn = Math.floor(tempradi*10);
	if 		(high>0.575) sub_height = 4;
	else if (high>0.525) sub_height = 3;
	else if (high>0.475) sub_height = 2;
	else if (high>0.425) sub_height = 1;
	else 				 sub_height = 0;
	sub_div = Math.floor(quad*24%1*5);
	sub_exn = Math.floor(radi*10%1*5);*/
}

function MakeGalaxyGrid() {
	grid = new THREE.Object3D();
	galaxy.add(grid);
	sectors = new THREE.Object3D();
	grid.add(sectors);
	
	var lmaterial = new THREE.LineBasicMaterial({
		color: 0x888888
	});

	var lgeometry = new THREE.Geometry();
	for (var i=0;i<10;i++) {
		for (var j=0;j<24;j++) {
		  lgeometry.vertices.push(new THREE.Vector3( (i*500+500)*Math.cos(j/12*Math.PI), 0, (i*500+500)*Math.sin(j/12*Math.PI) ));
		  //lgeometry.vertices.push(new THREE.Vector3( (i*500+500)*Math.cos((j+1)/12*Math.PI), 0, (i*500+500)*Math.sin((j+1)/12*Math.PI) )); //72
		  lgeometry.vertices.push(new THREE.Vector3( (i*500)*Math.cos(j/12*Math.PI), 0, (i*500)*Math.sin(j/12*Math.PI) ));
		  lgeometry.vertices.push(new THREE.Vector3( (i*500+500)*Math.cos(j/12*Math.PI), 0, (i*500+500)*Math.sin(j/12*Math.PI) ));
		  SectorControl(i,j);
		  GreekLetter(i,j);
		}
		lgeometry.vertices.push(new THREE.Vector3( (i*500+500)*Math.cos(j/12*Math.PI), 0, (i*500+500)*Math.sin(j/12*Math.PI) )); //V72
	}
	for (var j=0;j<24;j++) {
		var greekTexture = new THREE.ImageUtils.loadTexture( 'img/greek/'+j+'.png' );
		var greekMaterial = new THREE.MeshBasicMaterial( { map: greekTexture, color: 0x888888, side: THREE.DoubleSide } );
		var greekGeometry = new THREE.PlaneBufferGeometry(320, 320,10,10);
		var letter = new THREE.Mesh(greekGeometry, greekMaterial);
		letter.position.y = 0;
		letter.position.x = 5200*Math.cos(j/12*Math.PI+0.12);
		letter.position.z = 5200*Math.sin(j/12*Math.PI+0.12);
		letter.rotation.x = - Math.PI / 2;
		letter.rotation.z = - ((j+6.6)/12*Math.PI);
		//letter.rotation.y = Math.PI;
		grid.add(letter);
	}
	var line = new THREE.Line( lgeometry, lmaterial, THREE.LineSegments);
	grid.add( line );

	secgrid = new THREE.Object3D(); 
	secgridbox = new THREE.Mesh (new THREE.Geometry(), new THREE.MeshBasicMaterial( {transparent:true, opacity: 0.0, side: THREE.DoubleSide, color: new THREE.Color(0x00ffff) } ));
	galaxy.add(secgrid); secgrid.visible = false;
	secgridmesh = new THREE.Line( new THREE.Geometry(), new THREE.LineBasicMaterial({ color: 0x888888 }), THREE.LineSegments);
	secgrid.add(secgridmesh);
	secgrid.add(secgridbox);
	subgrid = new THREE.Object3D(); 
	subgridbox = new THREE.Object3D();
	galaxy.add(subgrid); subgrid.visible = false;
	subgridmesh = new THREE.Line( new THREE.Geometry(), new THREE.LineBasicMaterial({ color: 0x888888 }), THREE.LineSegments);
	subgrid.add(subgridmesh);
	subgrid.add(subgridbox);
}

function GreekLetter(radius,ang) {
	var greekTexture = new THREE.ImageUtils.loadTexture( './img/greek/'+ang+'.png' );
	var greekMaterial = new THREE.MeshBasicMaterial( { map: greekTexture, color: 0x888888, side: THREE.DoubleSide } );
	var greekGeometry = new THREE.PlaneBufferGeometry(radius*10+8, radius*10+8,10,10);
	var letter = new THREE.Mesh(greekGeometry, greekMaterial);
	letter.position.y = -10;
	letter.position.x = (radius*490+490)*Math.cos(ang/12*Math.PI+0.23-0.01/(radius+1));
	letter.position.z = (radius*490+490)*Math.sin(ang/12*Math.PI+0.23-0.01/(radius+1));
	letter.rotation.x = - Math.PI / 2;
	letter.rotation.z = - ((ang+6.9)/12*Math.PI);
	//letter.rotation.y = Math.PI;
	grid.add(letter);
	var figurTexture = new THREE.ImageUtils.loadTexture( './img/figur/'+radius+'.png' );
	var figurMaterial = new THREE.MeshBasicMaterial( { map: figurTexture, color: 0x888888, side: THREE.DoubleSide } );
	var figurGeometry = new THREE.PlaneBufferGeometry(radius*10+8,radius*10+8,10,10);
	var figure = new THREE.Mesh(figurGeometry, figurMaterial);
	figure.position.y = -10;
	figure.position.x = (radius*490+490)*Math.cos(ang/12*Math.PI+0.25-0.01/(radius+1));
	figure.position.z = (radius*490+490)*Math.sin(ang/12*Math.PI+0.25-0.01/(radius+1));
	figure.rotation.x = - Math.PI / 2;
	figure.rotation.z = - ((ang+6.9)/12*Math.PI);
	//letter.rotation.y = Math.PI;
	grid.add(figure);
}

function SectorControl(radius,ang) {
	var scgeom = new THREE.Geometry();
	scgeom.vertices.push (new THREE.Vector3 ( (radius*500)*Math.cos(ang/12*Math.PI),1,(radius*500)*Math.sin(ang/12*Math.PI) ) );
	scgeom.vertices.push (new THREE.Vector3 ( (radius*500+500)*Math.cos(ang/12*Math.PI),1,(radius*500+500)*Math.sin(ang/12*Math.PI) ) );
	scgeom.vertices.push (new THREE.Vector3 ( (radius*500+500)*Math.cos((ang+1)/12*Math.PI),1,(radius*500+500)*Math.sin((ang+1)/12*Math.PI) ) );
	scgeom.vertices.push (new THREE.Vector3 ( (radius*500)*Math.cos((ang+1)/12*Math.PI),1,(radius*500)*Math.sin((ang+1)/12*Math.PI) ) );
	scgeom.faces.push (new THREE.Face3 (0, 1, 2));
	scgeom.faces.push (new THREE.Face3 (0, 2, 3));
	scgeom.computeFaceNormals ();
	var scmesh = new THREE.Mesh (scgeom, new THREE.MeshBasicMaterial( {transparent:true, opacity: 0.0, side: THREE.DoubleSide, color: new THREE.Color(0x00ffff) } ));
		scmesh.div = ang;
		scmesh.exn = radius;
	sectors.add (scmesh);
}

function MakeSectorGrid(div,exn) {
	grid.visible = false;
	secgrid.visible = true;
	subgrid.visible = false;
	sector_exn = exn;
	sector_div = div;

	var sh = exn<3?2:(exn<8?1:0);
	if (sh == 0) sub_height = 0;
	var newvertices = [];
	newvertices = CubeLineVertices(newvertices,exn,div,-sh,1,1,1+sh*2);
	SectorBox(exn,div,-sh,1,1,1+sh*2);
	SubsecBox(exn,div,-sh,1,1,1+sh*2);

	secgridmesh.geometry.dispose();
	secgridmesh.geometry = new THREE.Geometry();
	secgridmesh.geometry.vertices = newvertices;
	secgridmesh.verticesNeedUpdate = true;
	
	var subvertices = [];
	for (var h=-sh;h<=sh;h++) {
		for (var sq=0;sq<5;sq++) { 
			for (var sr=0;sr<5;sr++) { 
				subvertices = CubeLineVertices(subvertices,exn+0.2*sr,div+0.2*sq,h,0.2,0.2,1);
			}
			subvertices.push(new THREE.Vector3( (exn*500)*Math.cos((div+0.2*sq)/12*Math.PI),-50+h*100, (exn*500)*Math.sin((div+0.2*sq)/12*Math.PI) ));
		}
		subvertices.push(new THREE.Vector3( (exn*500)*Math.cos((div+0.8)/12*Math.PI),-50+h*100+100, (exn*500)*Math.sin((div+0.8)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500)*Math.cos((div+0.6)/12*Math.PI),-50+h*100+100, (exn*500)*Math.sin((div+0.6)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500)*Math.cos((div+0.4)/12*Math.PI),-50+h*100+100, (exn*500)*Math.sin((div+0.4)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500)*Math.cos((div+0.2)/12*Math.PI),-50+h*100+100, (exn*500)*Math.sin((div+0.2)/12*Math.PI) ));
	}	
	subgridmesh.geometry.dispose();
	subgridmesh.geometry = new THREE.Geometry();
	subgridmesh.geometry.vertices = subvertices;
	subgridmesh.verticesNeedUpdate = true;
}

function MakeSliceGrid(height) {

	secgrid.visible = true;
	subgrid.visible = false;
	sub_height = height;

	var newvertices = [];
	newvertices = CubeLineVertices(newvertices,sector_exn,sector_div,height,1,1,1);
	SectorBox(sector_exn,sector_div,height,1,1,1);
	SubsecBox(sector_exn,sector_div,height,1,1,1);

	secgridmesh.geometry.dispose();
	secgridmesh.geometry = new THREE.Geometry();
	secgridmesh.geometry.vertices = newvertices;
	secgridmesh.verticesNeedUpdate = true;
	
	var subvertices = [];
	for (var sq=0;sq<5;sq++) { 
		for (var sr=0;sr<5;sr++) { 
			subvertices = CubeLineVertices(subvertices,sector_exn+0.2*sr,sector_div+0.2*sq,height,0.2,0.2,1);
		}
		subvertices.push(new THREE.Vector3( (sector_exn*500)*Math.cos((sector_div+0.2*sq)/12*Math.PI),-50+height*100, (sector_exn*500)*Math.sin((sector_div+0.2*sq)/12*Math.PI) ));
	}
	subgridmesh.geometry.dispose();
	subgridmesh.geometry = new THREE.Geometry();
	subgridmesh.geometry.vertices = subvertices;
	subgridmesh.verticesNeedUpdate = true;
}

function MakeSubGrid(div,exn) {
	secgrid.visible = true;
	subgrid.visible = false;
	sub_exn = exn;
	sub_div = div;

	var newvertices = [];
	newvertices = CubeLineVertices(newvertices,sector_exn+0.2*exn,sector_div+0.2*div,sub_height,0.2,0.2,1);
	SectorBox(0,0,0,0.1,0.1,1);
	SubsecBox(0,0,0,0.1,0.1,1);

	secgridmesh.geometry.dispose();
	secgridmesh.geometry = new THREE.Geometry();
	secgridmesh.geometry.vertices = newvertices;
	secgridmesh.verticesNeedUpdate = true;
	
	var subvertices = [];
	subgridmesh.geometry.dispose();
	subgridmesh.geometry = new THREE.Geometry();
	subgridmesh.geometry.vertices = subvertices;
	subgridmesh.verticesNeedUpdate = true;
}
/*
function MakeSubSectorGridExtended(exn,div) {
	var sh = exn<3?2:1;
	var subvertices = [];
	for (var h=-sh;h<=sh;h++) {
		for (var sq=-1;sq<6;sq++) { 
			for (var sr=-1;sr<6;sr++) { 
				subvertices = CubeLineVertices(subvertices,exn+0.2*sr,div+0.2*sq,h,0.2,0.2,1);
			}
			subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+0.2*sq)/12*Math.PI),-50+h*100, (exn*500-100)*Math.sin((div+0.2*sq)/12*Math.PI) ));
		}
		subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+1.0)/12*Math.PI),-50+h*100+100, (exn*500-100)*Math.sin((div+1.0)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+0.8)/12*Math.PI),-50+h*100+100, (exn*500-100)*Math.sin((div+0.8)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+0.6)/12*Math.PI),-50+h*100+100, (exn*500-100)*Math.sin((div+0.6)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+0.4)/12*Math.PI),-50+h*100+100, (exn*500-100)*Math.sin((div+0.4)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+0.2)/12*Math.PI),-50+h*100+100, (exn*500-100)*Math.sin((div+0.2)/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500-100)*Math.cos((div+0.0)/12*Math.PI),-50+h*100+100, (exn*500-100)*Math.sin((div+0.0)/12*Math.PI) ));
	}
	subgridmesh.geometry.dispose();
	subgridmesh.geometry = new THREE.Geometry();
	subgridmesh.geometry.vertices = subvertices;
	subgridmesh.verticesNeedUpdate = true;
}

function MakeSubSectorGridFocus(exn,div,ht,rt,dt) {
	var sh = exn<3?2:1;
	var subvertices = [];
	for (var h=Math.max(ht-1,-sh);h<=ht+1 && h<=sh;h++) {
		for (var sq=dt-1;sq<dt+2;sq++) { 
			for (var sr=rt-1;sr<rt+2;sr++) { 
				subvertices = CubeLineVertices(subvertices,exn+0.2*sr,div+0.2*sq,h,0.2,0.2,1);
			}
			subvertices.push(new THREE.Vector3( (exn*500+100*(rt-1))*Math.cos((div+0.2*sq)/12*Math.PI),-50+h*100, (exn*500+100*(rt-1))*Math.sin((div+0.2*sq)/12*Math.PI) ));
		}
		subvertices.push(new THREE.Vector3( (exn*500+100*(rt-1))*Math.cos((div+0.2*(dt+1))/12*Math.PI),-50+h*100+100, (exn*500+100*(rt-1))*Math.sin((div+0.2*(dt+1))/12*Math.PI) ));
		subvertices.push(new THREE.Vector3( (exn*500+100*(rt-1))*Math.cos((div+0.2*(dt  ))/12*Math.PI),-50+h*100+100, (exn*500+100*(rt-1))*Math.sin((div+0.2*(dt  ))/12*Math.PI) ));
	}
	subgridmesh.geometry.dispose();
	subgridmesh.geometry = new THREE.Geometry();
	subgridmesh.geometry.vertices = subvertices;
	subgridmesh.verticesNeedUpdate = true;
}

function MakeSubSectorGridAlone(exn,div,ht,rt,dt) {

	var subvertices = [];
		subvertices = CubeLineVertices(subvertices,exn+0.2*rt,div+0.2*dt,ht,0.2,0.2,1);
	subgridmesh.geometry.dispose();
	subgridmesh.geometry = new THREE.Geometry();
	subgridmesh.geometry.vertices = subvertices;
	subgridmesh.verticesNeedUpdate = true;
}*/

/*function ResetGrid() {
	var newvertices = [new THREE.Vector3(0,0,0),new THREE.Vector3(1000,0,0)];
	//newvertices = CubeLineVertices(newvertices,exn,div,0,1,1,1);
	secgridmesh.geometry.dispose()
	secgridmesh.geometry = new THREE.Geometry();
	secgridmesh.geometry.vertices = newvertices;
	secgridmesh.geometry.verticesNeedUpdate = true;
}*/

function CubeLineVertices(array,r,d,h,x,y,z) {
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100+100*z , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -50+h*100+100*z , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -50+h*100       , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -50+h*100       , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -50+h*100+100*z , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -50+h*100+100*z , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -50+h*100       , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -50+h*100+100*z , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -50+h*100+100*z , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -50+h*100       , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -50+h*100+100*z , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100+100*z , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500      )*Math.sin( d     /12*Math.PI) ));
	return array;
}

function SectorBox(r,d,h,x,y,z) {
	var vert = []; var face = [];
	vert.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500      )*Math.sin( d     /12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -50+h*100+100*z , (r*500      )*Math.sin( d     /12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -50+h*100+100*z , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -50+h*100       , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -50+h*100       , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -50+h*100+100*z , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -50+h*100+100*z , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	vert.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -50+h*100       , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	face.push(new THREE.Face3 (0, 1, 2));
	face.push(new THREE.Face3 (0, 2, 3));
	face.push(new THREE.Face3 (2, 3, 4));
	face.push(new THREE.Face3 (2, 4, 5));
	face.push(new THREE.Face3 (1, 2, 5));
	face.push(new THREE.Face3 (1, 5, 6));
	face.push(new THREE.Face3 (0, 1, 6));
	face.push(new THREE.Face3 (0, 6, 7));
	face.push(new THREE.Face3 (0, 3, 4));
	face.push(new THREE.Face3 (0, 4, 7));
	face.push(new THREE.Face3 (4, 5, 6));
	face.push(new THREE.Face3 (4, 6, 7));
	secgridbox.geometry.dispose()
	secgridbox.geometry = new THREE.Geometry();
	secgridbox.geometry.vertices = vert;
	secgridbox.geometry.verticesNeedUpdate = true;
	secgridbox.geometry.faces = face;
	secgridbox.geometry.elementsNeedUpdate = true;
	//if (secgridbox.geometry) secgridbox.geometry.dispose();
}

function SubsecBox(r,d,h,x,y,z) {
	while (subgridbox.children.length>0) {
		subgridbox.children[0].geometry.dispose();
		subgridbox.children[0].material.dispose();
		subgridbox.children[0].parent = null;
		subgridbox.children.splice( 0, 1 );
	}
	if (z>1) {
		for (var i=h;i<(h+z);i++) {
			var sligeom = new THREE.Geometry();
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos( d       /12*Math.PI), -50+i*100     , (r*500      )*Math.sin( d       /12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos( d       /12*Math.PI), -50+i*100+100 , (r*500      )*Math.sin( d       /12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.2*y)/12*Math.PI), -50+i*100     , (r*500      )*Math.sin((d+0.2*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.2*y)/12*Math.PI), -50+i*100+100 , (r*500      )*Math.sin((d+0.2*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.4*y)/12*Math.PI), -50+i*100     , (r*500      )*Math.sin((d+0.4*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.4*y)/12*Math.PI), -50+i*100+100 , (r*500      )*Math.sin((d+0.4*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.6*y)/12*Math.PI), -50+i*100     , (r*500      )*Math.sin((d+0.6*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.6*y)/12*Math.PI), -50+i*100+100 , (r*500      )*Math.sin((d+0.6*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.8*y)/12*Math.PI), -50+i*100     , (r*500      )*Math.sin((d+0.8*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+0.8*y)/12*Math.PI), -50+i*100+100 , (r*500      )*Math.sin((d+0.8*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+1.0*y)/12*Math.PI), -50+i*100     , (r*500      )*Math.sin((d+1.0*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500      )*Math.cos((d+1.0*y)/12*Math.PI), -50+i*100+100 , (r*500      )*Math.sin((d+1.0*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1.0*y)/12*Math.PI), -50+i*100     , (r*500+500*x)*Math.sin((d+1.0*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1.0*y)/12*Math.PI), -50+i*100+100 , (r*500+500*x)*Math.sin((d+1.0*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.8*y)/12*Math.PI), -50+i*100     , (r*500+500*x)*Math.sin((d+0.8*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.8*y)/12*Math.PI), -50+i*100+100 , (r*500+500*x)*Math.sin((d+0.8*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.6*y)/12*Math.PI), -50+i*100     , (r*500+500*x)*Math.sin((d+0.6*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.6*y)/12*Math.PI), -50+i*100+100 , (r*500+500*x)*Math.sin((d+0.6*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.4*y)/12*Math.PI), -50+i*100     , (r*500+500*x)*Math.sin((d+0.4*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.4*y)/12*Math.PI), -50+i*100+100 , (r*500+500*x)*Math.sin((d+0.4*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.2*y)/12*Math.PI), -50+i*100     , (r*500+500*x)*Math.sin((d+0.2*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+0.2*y)/12*Math.PI), -50+i*100+100 , (r*500+500*x)*Math.sin((d+0.2*y)/12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d       /12*Math.PI), -50+i*100     , (r*500+500*x)*Math.sin( d       /12*Math.PI) ));
			sligeom.vertices.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d       /12*Math.PI), -50+i*100+100 , (r*500+500*x)*Math.sin( d       /12*Math.PI) ));
			for (var n=0;n<22;n++) {
				sligeom.faces.push(new THREE.Face3( n, n+1, n+2));
			}
			sligeom.faces.push(new THREE.Face3( 0, 1,22));
			sligeom.faces.push(new THREE.Face3( 1,22,23));
			sligeom.computeFaceNormals ();
			var slimesh = new THREE.Mesh (sligeom, new THREE.MeshBasicMaterial( {transparent:true, opacity: 0.0, side: THREE.DoubleSide, color: new THREE.Color(0x00ffff) } ));
				slimesh.height = i;
			subgridbox.add(slimesh);
		}
	} else {
		for (var sq=0;sq<5;sq++) { 
			for (var sr=0;sr<5;sr++) { 
				var sligeom = new THREE.Geometry();
				sligeom.vertices.push(new THREE.Vector3( (r*500+100*sr	  )*Math.cos((d+0.2*sq    )/12*Math.PI), 0+h*100 , (r*500+100*sr	)*Math.sin((d+0.2*sq    )/12*Math.PI) ));
				sligeom.vertices.push(new THREE.Vector3( (r*500+100*sr	  )*Math.cos((d+0.2*sq+0.2)/12*Math.PI), 0+h*100 , (r*500+100*sr	)*Math.sin((d+0.2*sq+0.2)/12*Math.PI) ));
				sligeom.vertices.push(new THREE.Vector3( (r*500+100*sr+100)*Math.cos((d+0.2*sq+0.2)/12*Math.PI), 0+h*100 , (r*500+100*sr+100)*Math.sin((d+0.2*sq+0.2)/12*Math.PI) ));
				sligeom.vertices.push(new THREE.Vector3( (r*500+100*sr+100)*Math.cos((d+0.2*sq    )/12*Math.PI), 0+h*100 , (r*500+100*sr+100)*Math.sin((d+0.2*sq    )/12*Math.PI) ));
				sligeom.faces.push(new THREE.Face3 (0, 1, 2));
				sligeom.faces.push(new THREE.Face3 (0, 2, 3));
				sligeom.computeFaceNormals ();
				var slimesh = new THREE.Mesh (sligeom, new THREE.MeshBasicMaterial( {transparent:true, opacity: 0.0, side: THREE.DoubleSide, color: new THREE.Color(0x00ffff) } ));
					slimesh.div = sq;
					slimesh.exn = sr;
				subgridbox.add(slimesh);
			}
		}
	}
}
/*	
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -320+h*128       , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -320+h*128+640*z , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -320+h*128+640*z , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -320+h*128       , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -320+h*128       , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -320+h*128+640*z , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -320+h*128+640*z , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -320+h*128       , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -320+h*128       , (r*500      )*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -320+h*128       , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos((d+1*y)/12*Math.PI), -320+h*128+640*z , (r*500      )*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -320+h*128+640*z , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos((d+1*y)/12*Math.PI), -320+h*128+640*z , (r*500+500*x)*Math.sin((d+1*y)/12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -320+h*128+640*z , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500+500*x)*Math.cos( d     /12*Math.PI), -320+h*128       , (r*500+500*x)*Math.sin( d     /12*Math.PI) ));
	array.push(new THREE.Vector3( (r*500      )*Math.cos( d     /12*Math.PI), -320+h*128       , (r*500      )*Math.sin( d     /12*Math.PI) ));
*/