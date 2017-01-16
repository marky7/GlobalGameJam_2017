//SCENE FILE, replace NewScene by the scene name you want
var NewScene = new THREE.Object3D();

NewScene.show = function() { if (!NewScene.visible) {
    //Hide all other scenes
    HideAll();
    //camera control option for this scene
    controls.minDistance =  250;
    controls.maxDistance = 10000;
    controls.userPanSpeed = 4;
    //place the camera, focus center, then play 'spawn' animation
    camera.position.set(0,1500,2000);
    controls.center.set(0,0,0);
    controls.traveling(new THREE.Vector3(),2500);
    //once cam is ready, show the scene
    NewScene.visible = true;
}}

NewScene.init = function() {
    //we add our new scene to the game engine
    scene.add(NewScene);

    //For each group of object you need inside your scene, create an empty array
    NewScene.node = [];

    //Futhermore if you need to interact with 3D element, prepare an over array
    NewScene.over = [];

    //bring the light to the full scene
    var alight = new THREE.AmbientLight(0x888888);
    NewScene.add(alight);

    //free use lighting point
    //var plight = new THREE.PointLight(0xbbbbbb);
    //    plight.position.setY(1000); //offset point light position
    //NewScene.add(plight);


    // Star Skybox example 1
    //var skyGeometry = new THREE.SphereBufferGeometry(200000, 32, 32);
    //var skyMaterial = new THREE.MeshBasicMaterial({
    //		map: THREE.ImageUtils.loadTexture( "img/starbox/skystar.jpg" ),
    //		color : 0xbbdddd,
    //		side: THREE.BackSide
    //	});
    //NewScene.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    //NewScene.add( NewScene.skyBox );

    // Star Skybox example 2
    NewScene.background = new THREE.CubeTextureLoader()
        .setPath( 'img/starbox/' )
        .load( [ 's_px.jpg', 's_nx.jpg', 's_py.jpg', 's_ny.jpg', 's_pz.jpg', 's_nz.jpg' ] );

    //overing sprite example
    //this item must be added on the GUI scene, so we use guisc.add()
    var focusMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.ImageUtils.loadTexture( './img/focus.jpg',{}, function() { guisc.add(NewScene.focusSprite); } ),
            useScreenCoordinates: false,
            color: 0xffffff,//0xffbb66,
            transparent: false,
            blending: THREE.AdditiveBlending
        });
    NewScene.focusSprite = new THREE.Sprite( focusMaterial );
    NewScene.focusSprite.scale.set(256, 256, 1.0);//size
    NewScene.focusSprite.position.setX(12);//texture offset
    NewScene.focusSprite.visible = false;//show only when overed
    //textured object must not be added directly, use loadTexture callback

    //Animation of your scene, must be called by main-update
    NewScene.animate = function(delta) {
        NewScene.rotation.y -= 0.02*delta;
    }

    //Finish instancing all your objects
    //Theirs data are stored at the end of this file
    for (var i=0;i<NewScene.data.length;i++) {
        NewScene.node.push(new Node(NewScene.data[i]));
    }
}

//After the init function, add your code custom function/objects
//The construction of this scene is a bit disturbing, but each will be unique ^^
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
    //Add some properties for over interaction
    mesh.name = data.name;
    mesh.tid  = data.id;
    //add to the scene to be rendered
    NewScene.add(mesh)
    //Here bind properties to the SAME object you push into the 'over' array
    NewScene.over.push(mesh);

    //Once the sphere is ready, connect to other spheres
    for(var i=0;i<this.link.length;i++){
        if (this.link[i]<this.id) {
            if (GetNode(this.link[i]).unlock && this.unlock)
                NewScene.Link(this.position,GetNodePos(this.link[i]));
        }
    }
}

//This object is a sub product of Node, and we dont interact with it,
// so we dont need to index it inside an array.
NewScene.Link = function(pos1,pos2) {
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
    NewScene.add( mesh );
};

function GetNodePos(id) {
    for (var i=0;i<NewScene.data.length;i++) {
        var d = NewScene.data[i];
        if (id == d.id) {
            return new THREE.Vector3(d.x,d.y,d.z);
        }}
    return new THREE.Vector3();//default
}

function GetNode(id) {
    for (var i=0;i<NewScene.node.length;i++) {
        var n = NewScene.node[i];
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

//to place in Utils
function C(r,g,b) {
    var red = r || Math.random()*255;
    var gre = g || Math.random()*255;
    var blu = b || Math.random()*255;
    return new THREE.Color("rgb("+Math.round(red)+","+Math.round(gre)+","+Math.round(blu)+")");
};

NewScene.data = [
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
