//SCENE FILE, replace Axoaya by the scene name you want
var Axoaya = new THREE.Object3D();
var nebula = new THREE.Object3D();

Axoaya.show = function() { if (!Axoaya.visible) {
    //Hide all other scenes
    HideAll();
    //camera control option for this scene
    controls.minDistance =  0.1;
    controls.maxDistance = 10000;
    controls.userPanSpeed = 0.01;
    controls.enabled = false;
    //place the camera, focus center, then play 'spawn' animation
    camera.position.set(0,0,1);
    controls.center.set(0,0,0);
    controls.traveling(new THREE.Vector3(),1);
    //once cam is ready, show the scene
    Axoaya.visible = true;
    MovingScene.visible = true;
}};

Axoaya.init = function() {
    //we add our new scene to the game engine
    Axoaya.rotation.y = -0.2;
    scene.add(Axoaya);
    var anchor = new THREE.Object3D();
    anchor.position.x = -110;
    anchor.position.y = -1;
    Axoaya.add(anchor);

    //For each group of object you need inside your scene, create an empty array
    Axoaya.node = [];

    //Futhermore if you need to interact with 3D element, prepare an over array
    Axoaya.over = [];

    //bring the light to the full scene
    Axoaya.alight = new THREE.AmbientLight(0x222222);
    Axoaya.add(Axoaya.alight);

    //anchor.add(nebula);
    nebula.geo = [];
    nebula.mat = [];
    nebula.uni = [];
    nebula.txt = [];
    nebula.nb = 10;
    Now();
    for (var i=0;i<nebula.nb;i++) {
        nebula.geo[i] = new THREE.SphereBufferGeometry(150000,32,32);//(i+5)*100
        nebula.uni[i] = {
            "texture": { type: "t", value: new THREE.TextureLoader().load('./img/nebula/'+i+'.png') },
            "size" : { type: "f", value: 0.5 },
	        "intensity" : { type: "f", value: 0.6 + Math.cos(NOW*2*(1+i)) * 0.4 }
        };

        //var nebulaatt = [];
        //var tempint = new Float32Array( nebula.nb );
        //for( var k = 0; k < nebula.nb; k++ ) {
        //    nebulaatt.push({ intensity: { type: "f", value: 0.6 + Math.cos(NOW*2*(1+k)) * 0.4 } });
        //}
        //system.geometry.addAttribute( 'intensity', new THREE.BufferAttribute( tempint, 1 ) );

        nebula.mat[i] = new THREE.ShaderMaterial({
            //uniforms: 		nebulauni,
            uniforms: 		nebula.uni[i],
            //attributes: 	nebulaatt[i],
            vertexShader:  	lightMapShader.vertexShader,
            fragmentShader: lightMapShader.fragmentShader,
            transparent: true,
            lights: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
    }

    for (var j=0;j<nebula.nb;j++) {
        var nebulaMesh = new THREE.Mesh(nebula.geo[j], nebula.mat[j]);//
        nebulaMesh.rotation.x = Math.random()*Math.PI*2;
        nebulaMesh.rotation.y = Math.random()*Math.PI*2;
        nebulaMesh.rotation.z = Math.random()*Math.PI*2;
        nebula.add(nebulaMesh);
    }
    //free use lighting point
    //var plight = new THREE.PointLight(0xbbbbbb);
    //    plight.position.setY(1000); //offset point light position
    //Axoaya.add(plight);

    //STARBOX
    var skyGeometry = new THREE.SphereBufferGeometry(100000, 32, 32);
    var skyMaterial = new THREE.MeshLambertMaterial({
    		map: THREE.ImageUtils.loadTexture( "img/starbox/skystar.jpg" ),
    		color : 0xbbdddd,
    		side: THREE.BackSide
    	});
    Axoaya.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    anchor.add( Axoaya.skyBox );

    //Create Sun and PointLight separatelly
    var slight = new THREE.PointLight(0xdddddd);
    slight.position.x = -1000;
    slight.position.y =  100;
    slight.position.z =  250;
    anchor.add(slight);
    var newstar = NewGenStar(10,1);
    newstar.position.x = -1000;
    newstar.position.y = 100;
    newstar.position.z = 250;
    newstar.visible = false;
    anchor.add(newstar);
    //init position for dark start
    anchor.rotation.y = -0.05;
    //Animation of your scene, must be called by main-update
    Axoaya.animate = function(delta) {Now();
        anchor.rotation.y -= 0.02*delta;
        if (anchor.rotation.y<-0.76) {
            newstar.visible = true;
        }
        if (anchor.rotation.y<(-Math.PI*2-0.05)) {
            anchor.rotation.y+=Math.PI*2;
            newstar.visible = false;
        }
        planetMesh.rotation.y -= 0.01*delta;
        Axoaya.alight.intensity = 1;//0.6+Math.sin(NOW*16)*0.4;
        newstar.update(NOW*1000);
        for( var i = 0; i < nebula.nb; i++ ) {
            //nebula.uni[i].intensity = { type: "f", value: 0.6 + Math.cos(NOW*2*(1+i)) * 0.4 };
        }
        ParticuleMove();
        //geometry.attributes.size.set(tempint);
        //geometry.attributes.size.needsUpdate = true;
    };

    Axoaya.reset = function() {
        anchor.rotation.y = -0.06-Math.PI*2;
    };

    //hide light in the planet to show rings
    var clight = new THREE.PointLight(0xdddddd);
    clight.position.y =  49;
    anchor.add(clight);

    var geop = new THREE.SphereBufferGeometry(50, 64, 64);//0000000

    matp= new THREE.MeshPhongMaterial();
    matp.map       	 = new THREE.TextureLoader().load('./img/planetmin/43d.jpg');
    //matp.normalMap   = new THREE.TextureLoader().load('./img/planet/Alien-n.png');
    //matp.normalScale = 0;
    matp.bumpMap   	= new THREE.TextureLoader().load('./img/planetmin/43n.jpg');
    matp.bumpScale 	= 0.1;
    //matp.specularMap= new THREE.TextureLoader().load('./img/planet/'+active_planet[p].ptype+'N.jpg');
    //matp.specular  	= new THREE.Color(0x2f2f2f);

    var planetMesh = new THREE.Mesh(geop, matp);
    anchor.add(planetMesh);

    var geometry = new THREE.RingGeometry(60, 120, 32, 16, 0, Math.PI * 2);
    var ring = new THREE.Mesh(geometry, RingMaterial);
    ring.rotation.x = Math.PI/2;
    anchor.add(ring);

    ParticuleInit();
    //Finish instancing all your objects
    //Theirs data are stored at the end of this file
    //for (var i=0;i<Axoaya.data.length;i++) {
        //Axoaya.node.push(new Node(Axoaya.data[i]));
    //}
};

var Asteropart = new THREE.Object3D();
var asteroTabX = [];
var asteroTabY = [];
function ParticuleInit() {
    Axoaya.add(Asteropart);
    Asteropart.rotation.y = 0.2;
    Asteropart.attributes = {
        size: {type: 'f', value: null},
        customColor: {type: 'c', value: null}
    };
    Asteropart.uniforms = {
        color: {type: "c", value: new THREE.Color(0xffffff)},
        texture: {type: "t", value: THREE.ImageUtils.loadTexture('./img/miniasteroid.jpg')}
    };
    Asteropart.shaderMaterial = new THREE.ShaderMaterial({
        uniforms: Asteropart.uniforms,
        attributes: Asteropart.attributes,
        vertexShader: StarShader.vertexShader,
        fragmentShader: StarShader.fragmentShader,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    Asteropart.geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(3000);
    var values_color = new Float32Array(3000);
    var values_size = new Float32Array(1000);
    for (var p=0;p<1000;p++) {
        asteroTabX[p] = Math.random()*10-5;
        asteroTabY[p] = Math.random()*2-1;
        positions[p*3+0] = asteroTabX[p];
        positions[p*3+1] = asteroTabY[p];
        positions[p*3+2] = (p%1000)-500;
        values_color[p*3+0] = 1;
        values_color[p*3+1] = 1;
        values_color[p*3+2] = 1;
        values_size[p] = (Math.random()*32+16)/1000;
    }
    Asteropart.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    Asteropart.geometry.addAttribute('customColor', new THREE.BufferAttribute(values_color, 3));
    Asteropart.geometry.addAttribute('size', new THREE.BufferAttribute(values_size, 1));
    stars = new THREE.PointCloud(Asteropart.geometry, Asteropart.shaderMaterial);
    stars.frustumCulled = false;
    Asteropart.add(stars);
}

function ParticuleMove() {
    var newpositions = new Float32Array( 3000 );

    for (var p=0;p<1000;p++) {
        newpositions[p*3+0] = asteroTabX[p];
        newpositions[p*3+1] = asteroTabY[p];
        newpositions[p*3+2] = -((p*0.005-NOW*5)%5)-5;
    }
    Asteropart.geometry.removeAttribute( 'position' );
    Asteropart.geometry.addAttribute( 'position', new THREE.BufferAttribute( newpositions, 3 ) );
}

var RingMaterial = new THREE.MeshPhongMaterial(
    {
        map: new THREE.TextureLoader().load('./img/ring.jpg'),
        //alphaMap: new THREE.TextureLoader().load('./img/star/sunred.jpg'),
        color: 0xffffff,
        specular: 0x555555,
        shininess: 3,
        emissive:10,
        side: THREE.DoubleSide,
        castshadow:true,
        transparent : true,
        opacity     : 0.8
    } );

//var ringMesh = new THREE.Mesh( RingGeometry() , THREE.MeshLambertMaterial );

/*/BETER EXAMPLE OF RINGS
var RingGeometry = function ( innerRadius, outerRadius, thetaSegments) {

    THREE.Geometry.call( this );

    innerRadius = innerRadius || 1000
    outerRadius = outerRadius || 800
    thetaSegments   = thetaSegments || 32

    var normal  = new THREE.Vector3( 0, 0, 1 );

    for(var i = 0; i < thetaSegments; i++ ){
        var angleLo = (i / thetaSegments) *Math.PI*2;
        var angleHi = ((i+1) / thetaSegments) *Math.PI*2;

        var vertex1 = new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0);
        var vertex2 = new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0);
        var vertex3 = new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0);
        var vertex4 = new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0);

        this.vertices.push( vertex1 );
        this.vertices.push( vertex2 );
        this.vertices.push( vertex3 );
        this.vertices.push( vertex4 );


        var vertexIdx   = i * 4;

        // Create the first triangle
        var face = new THREE.Face3(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2, normal);
        var uvs = [];

        var uv = new THREE.Vector2(0, 0);
        uvs.push(uv);
        uv = new THREE.Vector2(1, 0);
        uvs.push(uv);
        uv = new THREE.Vector2(0, 1);
        uvs.push(uv);

        this.faces.push(face);
        this.faceVertexUvs[0].push(uvs);

        // Create the second triangle
        var face = new THREE.Face3(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3, normal);
        var uvs = [];

        uv = new THREE.Vector2(0, 1);
        uvs.push(uv);
        uv = new THREE.Vector2(1, 0);
        uvs.push(uv);
        uv = new THREE.Vector2(1, 1);
        uvs.push(uv);

        this.faces.push(face);
        this.faceVertexUvs[0].push(uvs);
    }

    //this.computeCentroids();
    //this.computeFaceNormals();

};
RingGeometry.prototype = Object.create( THREE.Geometry.prototype );

*/

//EXAMPLE OF RINGS
/*
 app.view.milkyway.saturn.Rings = class extends THREE.Geometry {
 config() {
 return {
 innerRadius: .5,
 outerRadius: 1,
 gridY: 200,
 autoInit: false
 }
 }
 constructor(config) {
 super();
 this._innerRadius = config && config.hasOwnProperty('innerRadius') ? config.innerRadius : this.config().innerRadius;
 this._outerRadius = config && config.hasOwnProperty('outerRadius') ? config.outerRadius : this.config().outerRadius;
 this._gridY = config && config.hasOwnProperty('gridY') ? config.gridY : this.config().gridY;
 this._autoInit = config && config.hasOwnProperty('autoInit') ? config.autoInit : this.config().autoInit;
 if (this.autoInit) {
 this.init();
 }
 }
 get innerRadius() {
 return this._innerRadius;
 }
 get outerRadius() {
 return this._outerRadius;
 }
 get gridY() {
 return this._gridY;
 }
 get autoInit() {
 return this._autoInit;
 }
 init() {
 let twopi = 2 * Math.PI,
 iVer = Math.max(2, this.gridY);
 for (let i = 0; i < (iVer + 1); i++) {
 let fRad1 = i / iVer,
 fRad2 = (i + 1) / iVer,
 fX1 = this.innerRadius * Math.cos(fRad1 * twopi),
 fY1 = this.innerRadius * Math.sin(fRad1 * twopi),
 fX2 = this.outerRadius * Math.cos(fRad1 * twopi),
 fY2 = this.outerRadius * Math.sin(fRad1 * twopi),
 fX4 = this.innerRadius * Math.cos(fRad2 * twopi),
 fY4 = this.innerRadius * Math.sin(fRad2 * twopi),
 fX3 = this.outerRadius * Math.cos(fRad2 * twopi),
 fY3 = this.outerRadius * Math.sin(fRad2 * twopi),
 v1 = new THREE.Vector3(fX1, fY1, 0),
 v2 = new THREE.Vector3(fX2, fY2, 0),
 v3 = new THREE.Vector3(fX3, fY3, 0),
 v4 = new THREE.Vector3(fX4, fY4, 0);
 this.vertices.push(new THREE.Vertex(v1));
 this.vertices.push(new THREE.Vertex(v2));
 this.vertices.push(new THREE.Vertex(v3));
 this.vertices.push(new THREE.Vertex(v4));
 }
 for (let i = 0; i < (iVer + 1); i++) {
 this.faces.push(new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2));
 this.faces.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3));
 this.faceVertexUvs[0].push([
 new THREE.UV(0, 1),
 new THREE.UV(1, 1),
 new THREE.UV(1, 0)
 ]);
 this.faceVertexUvs[0].push([
 new THREE.UV(0, 1),
 new THREE.UV(1, 0),
 new THREE.UV(0, 0)
 ]);
 }
 this.computeCentroids();
 this.computeFaceNormals();
 this.boundingSphere = {
 radius: this.outerRadius
 };
 }
 }


 app.view.milkyway.saturn.Saturn = class extends app.view.milkyway.Planet {
 constructor() {
 super({
 type: app.view.milkyway.Saturn,
 size: 9.41,
 distance: 10,
 period: 2, // 29.46
 map: metadata.urls.saturn.surfaceMaterial
 });
 }
 get globeMesh() {
 return this._globeMesh;
 }
 get animateOrbit() {
 return true;
 }
 get ringsMesh() {
 return this._ringsMesh;
 }
 get planetGroup() {
 return this._planetGroup;
 }
 get planetOrbitGroup() {
 return this._planetOrbitGroup;
 }
 get tilt() {
 return -0.466;
 }
 get rotationY() {
 return 0.003;
 }
 createGlobe() {
 let geometry = new THREE.SphereGeometry(7, 32, 32),
 texture = THREE.ImageUtils.loadTexture(this.map),
 material = new THREE.MeshPhongMaterial({
 map: texture
 }),
 globeMesh = new THREE.Mesh(geometry, material);
 globeMesh.rotation.z = .1;
 this.object3D.add(globeMesh);
 this._globeMesh = globeMesh;
 }
 createRings() {
 let ringsmap = metadata.urls.saturn.ringsMaterial,
 geometry = new app.view.milkyway.saturn.Rings({
 innerRadius: 1.1,
 outerRadius: 1.867,
 gridY: 200,
 autoInit: true
 }),
 texture = THREE.ImageUtils.loadTexture(ringsmap),
 material = new THREE.MeshLambertMaterial({
 map: texture,
 transparent: false,
 ambient: 0xffffff
 }),
 ringsMesh = new THREE.Mesh(geometry, material);
 ringsMesh.doubleSided = true;
 ringsMesh.rotation.x = 2.21;
 ringsMesh.rotation.y = .09;
 this.planetGroup.add(ringsMesh);
 this.planetGroup.position.x = -.2;
 this.planetGroup.position.z = -1;
 this.planetGroup.position.y = 1;
 this._ringsMesh = ringsMesh;
 }
 update() {
 if (this.globeMesh) {
 this.globeMesh.rotation.y += this.rotationY / this.period;
 }
 if (this.ringsMesh) {
 this.ringsMesh.rotation.z -= this.rotationY / this.period;
 }
 this.updateChildren();
 }
 init() {
 let planetOrbitGroup = new THREE.Object3D(),
 planetGroup = new THREE.Object3D(),
 distSquared = this.distance * this.distance;
 planetGroup.position.set(Math.sqrt(distSquared / 2), 0, -Math.sqrt(distSquared / 2));
 planetOrbitGroup.add(planetGroup);
 planetGroup.scale.set(this.size, this.size, this.size);
 planetGroup.rotation.x = this.tilt;
 this.object3D = planetOrbitGroup;
 this._planetGroup = planetGroup;
 this._planetOrbitGroup = planetOrbitGroup;
 this.createRings();
 this.createGlobe();
 this.revolutionSpeed = this.rotationY;
 }
 }
 */