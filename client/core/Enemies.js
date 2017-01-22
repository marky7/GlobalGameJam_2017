var enemies = [];


// createSphere({bumpScale:1,mapUrl:'./img/planetmin/...',bumpMapUrl:'./img/planetmin/',scene:MovingScene,position:{x:0,y:0,z:0},speed:{x:0,y:0,z:100},sphereGeometry:[100,32,32]});
var createSphere = function(opt){
    var sphereGeo = new THREE.SphereBufferGeometry(opt.sphereGeometry[0], opt.sphereGeometry[1], opt.sphereGeometry[2]);
    var sphereMat = new THREE.MeshBasicMaterial();
    sphereMat.map  = new THREE.TextureLoader().load(opt.mapUrl); // './img/planetmin/'+active_planet[p].ptype+'d.jpg'
    sphereMat.bumpMap = new THREE.TextureLoader().load(opt.bumpMapUrl); // lumiere - './img/planetmin/'+active_planet[p].ptype+'n.jpg'
    sphereMat.bumpScale = opt.bumpScale;

    var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.x = opt.position.x;
    sphereMesh.position.y = opt.position.y;
    sphereMesh.position.z = opt.position.z;
    sphereMesh.speed = new THREE.Vector3(0,0,opt.speed);
    sphereMesh.name = 'sphere-'+Math.random()+'-'+Math.random();
    opt.scene.add(sphereMesh);
    enemies.push(sphereMesh);
};


// createCube({textureUrl:'img/planetmin/soleil1.jpg',scene:MovingScene,position:{x:0,y:0,z:0},speed:10,boxGeometry:[100,100,100]});
var createCube = function(opt){
    var cubeTexture = new THREE.TextureLoader().load( opt.textureUrl,function(){
        // update texture
        cubeTexture.verticesNeedUpdate = true;
    }.bind(this));
    var cubeGeometry = new THREE.BoxBufferGeometry( opt.boxGeometry[0], opt.boxGeometry[1], opt.boxGeometry[2]);
    var cubeMaterial = new THREE.MeshBasicMaterial({ map: cubeTexture });
    var cubemesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cubemesh.position.x = opt.position.x;
    cubemesh.position.y = opt.position.y;
    cubemesh.position.z = opt.position.z;
    cubemesh.speed = new THREE.Vector3(0,0,opt.speed);
    cubemesh.name = 'cube-'+Math.random()+'-'+Math.random();
    opt.scene.add( cubemesh );
    enemies.push(cubemesh);
};


var moveEnemies = function(){
    for(var i=0; i<enemies.length ; i++){
        // Move
        enemies[i].position.x += enemies[i].speed.x;
        enemies[i].position.y += enemies[i].speed.y;
        enemies[i].position.z += enemies[i].speed.z;
    }
};


var removeEnemies = function(curScene){
    for(var i=0; i<enemies.length ; i++){

        if(enemies[i].position.z >= -100){
            curScene.remove(curScene.getObjectByName(enemies[i].name));
        }
    }
};


// rangeX = [-10000,+10000];
// rangeY = [-5000,+5000];

var generateAsteroids = function(opt){

    var curParams;
    var diffX = opt.rangeX[1] - opt.rangeX[0];
    var diffY = opt.rangeY[1] - opt.rangeY[0];

    // Create all cubes from levels
    for(var i = 0; i<opt.levels[opt.curLevel].spheres.length; i++){
        var posX = Math.random()*diffX + opt.rangeX[0];
        var posY = Math.random()*diffY + opt.rangeY[0];

        curParams = opt.levels[opt.curLevel].spheres[i];
        curParams.scene = opt.scene;
        curParams.position = {x:posX,y:posY,z:opt.z0};
        createSphere(curParams);
    }

    // Create all spheres
    for(var j = 0; j<opt.levels[opt.curLevel].cubes.length; j++){
        curParams = opt.levels[opt.curLevel].cubes[j];
        var posX = Math.random()*diffX + opt.rangeX[0];
        var posY = Math.random()*diffY + opt.rangeY[0];
        curParams.scene = opt.scene;
        curParams.position = {x:posX,y:posY,z:opt.z0};
        createCube(curParams);
    }
};

