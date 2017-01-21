
// createSphere({bumpScale:1,mapUrl:'./img/planetmin/...',bumpMapUrl:'./img/planetmin/',scene:MovingScene,position:{x:0,y:0,z:0},speed:{x:0,y:0,z:100},sphereGeometry:[100,32,32]});

var enemies = [];

var createSphere = function(opt){
    //PLANET
    var geop = new THREE.SphereBufferGeometry(opt.sphereGeometry[0], opt.sphereGeometry[1], opt.sphereGeometry[2]);

    var newSphere= new THREE.MeshPhongMaterial();
    newSphere.map       	 = new THREE.TextureLoader().load(opt.mapUrl); // './img/planetmin/'+active_planet[p].ptype+'d.jpg'
    newSphere.bumpMap   	= new THREE.TextureLoader().load(opt.bumpMapUrl); // lumiere - './img/planetmin/'+active_planet[p].ptype+'n.jpg'
    newSphere.bumpScale 	= opt.bumpScale;

    var planetMesh = new THREE.Mesh(geop, newSphere);
    planetMesh.position.x = opt.position.x;
    planetMesh.position.y = opt.position.y;
    planetMesh.position.z = opt.position.z;
    opt.scene.add(planetMesh);
    planetMesh.speed = new THREE.Vector3(opt.speed.x,opt.speed.y,opt.speed.z);
    planetMesh.name = 'sphere-'+Math.random()+'-'+Math.random();
    enemies.push(planetMesh);
};

// createCube({textureUrl:'img/planetmin/soleil1.jpg',scene:MovingScene,position:{x:0,y:0,z:0},speed:10,boxGeometry:[100,100,100]});

var createCube= function(opt){
    var texture = new THREE.TextureLoader().load( opt.textureUrl,function(){
        // update texture
        texture.verticesNeedUpdate = true;
    }.bind(this));
    var geometry = new THREE.BoxBufferGeometry( opt.boxGeometry[0], opt.boxGeometry[1], opt.boxGeometry[2]);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    cubemesh = new THREE.Mesh( geometry, material );
    cubemesh.position.x = opt.position.x;
    cubemesh.position.y = opt.position.y;
    cubemesh.position.z = opt.position.z;
    opt.scene.add( cubemesh );

    cubemesh.speed = new THREE.Vector3(0,0,opt.speed);
    cubemesh.name = 'cube-'+Math.random()+'-'+Math.random();
    enemies.push(cubemesh);
};


var moveEnemies = function(){
    for(var i=0; i<enemies.length ; i++){
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
// interval
var confGenerator;
var createAsteroidGenerator = function(opt){

    confGenerator = opt;
    setInterval(function(){

        var diffX = confGenerator.rangeX[1] - confGenerator.rangeX[0];
        var diffY = confGenerator.rangeY[1] - confGenerator.rangeY[0];

        /*
        for(var i = 0; i<confGenerator.quantity; i++) {

        }*/

        var posX = Math.random()*diffX + confGenerator.rangeX[0];
        var posY = Math.random()*diffY + confGenerator.rangeY[0];
        // d : difuse
        createCube({textureUrl:'img/planetmin/7d.jpg',scene:MovingScene,position:{x:posX,y:posY,z:confGenerator.z0},speed:500,boxGeometry:[2000,2000,2000]});
        createSphere({bumpScale:1,mapUrl:'./img/planetmin/7d.jpg',bumpMapUrl:'./img/planetmin/7n.jpg',scene:MovingScene,position:{x:posX,y:posY,z:confGenerator.z0},speed:{x:0,y:0,z:300},sphereGeometry:[650,70,70]});
        // createSphere({bumpScale:1,mapUrl:'./img/planetmin/6d.jpg',bumpMapUrl:'./img/planetmin/6n.jpg',scene:MovingScene,position:{x:1000,y:1000,z:confGenerator.z0},speed:{x:0,y:0,z:300},sphereGeometry:[400,32,32]});
    }, opt.interval);
};

