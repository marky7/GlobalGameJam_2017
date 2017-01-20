//SCENE FILE, replace Axoaya by the scene name you want
var Axoaya = new THREE.Object3D();
var nebula = new THREE.Object3D();

Axoaya.show = function() { if (!Axoaya.visible) {
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
    Axoaya.visible = true;
}};

Axoaya.init = function() {
    //we add our new scene to the game engine
    scene.add(Axoaya);

    //For each group of object you need inside your scene, create an empty array
    Axoaya.node = [];

    //Futhermore if you need to interact with 3D element, prepare an over array
    Axoaya.over = [];

    //bring the light to the full scene
    Axoaya.alight = new THREE.AmbientLight(0xffffff);
    Axoaya.add(Axoaya.alight);

    Axoaya.add(nebula);
    nebula.geo = [];
    nebula.mat = [];
    nebula.txt = [];
    for (var i=0;i<10;i++) {
        nebula.geo[i] = new THREE.SphereBufferGeometry(i+1, 32, 32);
        var nebulauni = {
            "texture": { type: "t", value: THREE.ImageUtils.loadTexture('./img/nebula/'+i+'.png') },
            "size" : { type: "f", value: 0.5 }
//,	        "intensity" : { type: "f", value: 0.5 }
        };
        nebula.mat[i] = new THREE.ShaderMaterial({
            uniforms: 		nebulauni,
            vertexShader:  	lightMapShader.vertexShader,
            fragmentShader: lightMapShader.fragmentShader,
            transparent: true,
            lights: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
    }
    //free use lighting point
    //var plight = new THREE.PointLight(0xbbbbbb);
    //    plight.position.setY(1000); //offset point light position
    //Axoaya.add(plight);

    //STARBOX
    var skyGeometry = new THREE.SphereBufferGeometry(200000, 32, 32);
    var skyMaterial = new THREE.MeshLambertMaterial({
    		map: THREE.ImageUtils.loadTexture( "img/starbox/skystar.jpg" ),
    		color : 0xbbdddd,
    		side: THREE.BackSide
    	});
    Axoaya.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    Axoaya.add( Axoaya.skyBox );


    //Animation of your scene, must be called by main-update
    Axoaya.animate = function(delta) {Now();
        Axoaya.rotation.y -= 0.02*delta;
        Axoaya.alight.intensity = 0.6+Math.sin(NOW*16)*0.4;
    };

    //Finish instancing all your objects
    //Theirs data are stored at the end of this file
    //for (var i=0;i<Axoaya.data.length;i++) {
        //Axoaya.node.push(new Node(Axoaya.data[i]));
    //}
};