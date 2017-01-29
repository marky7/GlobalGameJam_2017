var bonus = [];

var createBonus = function(opt) {
    var randomNumber1 = Math.random();
    if(opt.ratioMT && (randomNumber1 < opt.ratioMT)){return;}
    if(opt.ratioLT && (randomNumber1 < opt.ratioLT<randomNumber1)){return;}

    var geometry3 = new THREE.IcosahedronGeometry( opt.height, 1 );
    var materials3 = [
        new THREE.MeshPhongMaterial( { color: opt.meshPhongColor, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 } ),
        new THREE.MeshBasicMaterial( { color: opt.meshBasicColor, shading: THREE.FlatShading, wireframe: false, transparent: true } )
    ];
    var bonus3 = THREE.SceneUtils.createMultiMaterialObject( geometry3, materials3 );

    opt.scene.add(bonus3);
    bonus3.type=opt.type;
    bonus3.radius = opt.height;
    bonus3.position.x = opt.position.x;
    bonus3.position.y = opt.position.y;
    bonus3.position.z = opt.position.z;
    bonus3.speed = new THREE.Vector3(0, 0, opt.speed);
    bonus3.active = true;
    bonus3.name = 'bonus-' + randomNumber1 + '-' + Math.random();
    bonus.push(bonus3);
};

var bonusSpeedFactor = 0.2;
var moveBonus = function(){
    for(var i=0; i<bonus.length ; i++){
        // Move
        bonus[i].position.x += bonus[i].speed.x*bonusSpeedFactor;
        bonus[i].position.y += bonus[i].speed.y*bonusSpeedFactor;
        bonus[i].position.z += bonus[i].speed.z*bonusSpeedFactor;
    }
};

var removeBonus = function(curScene){
    for(var i=0; i<bonus.length ; i++){

        if(bonus[i].position.z >= 2){
            bonus[i].active = false;
            curScene.remove(curScene.getObjectByName(bonus[i].name));
            bonus.splice(i,1);
            i--;
        }
    }
};

    /*
        var randomNumber1 = Math.random();
        if(opt.ration && (randomNumber1<opt.ration)){return;}
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
        sphereMesh.name = 'sphere-'+randomNumber1+'-'+Math.random();
        opt.scene.add(sphereMesh);
        bonus.push(sphereMesh);*/
