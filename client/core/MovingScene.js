var MovingScene = new THREE.Object3D();

MovingScene.show = function() { if (!MovingScene.visible) {
    HideAll();
    controls.minDistance =  1;
    controls.maxDistance = 10000;
    controls.userPanSpeed = 0;
    camera.position.set(0, 0, 10);
    controls.enabled = false;
    controls.center.set(0,0,0);
    controls.traveling(new THREE.Vector3(), 240);
    MovingScene.visible = true;
}};

MovingScene.init = function() {
    Axoaya.add(MovingScene);
    MovingScene.rotation.y=0.2;

    //light managed in Axoaya
    //var alight = new THREE.AmbientLight(0x888888);
    //MovingScene.add(alight);
    //var lollight = new THREE.AmbientLight(0xffffff);
    //MovingScene.add(lollight);
    //var plight = new THREE.PointLight(0x888888);
    //    plight.position.z = 1000;
    //MovingScene.add(plight);

    MovingScene.fires = [];

    //MovingScene.background = new THREE.CubeTextureLoader()
    //    .setPath( 'img/starbox/' )
    //    .load( [ 's_px.jpg', 's_nx.jpg', 's_py.jpg', 's_ny.jpg', 's_pz.jpg', 's_nz.jpg' ] );
    //scene.background = MovingScene.background;

    var coolDown = 10
    var players = [
        { up: false, left: false, down: false, right: false, action: false, cD: coolDown, xVel: 0, yVel: 0 },
        { up: false, left: false, down: false, right: false, action: false, cD: coolDown, xVel: 0, yVel: 0 },
        { up: false, left: false, down: false, right: false, action: false, cD: coolDown, xVel: 0, yVel: 0 },
        { up: false, left: false, down: false, right: false, action: false, cD: coolDown, xVel: 0, yVel: 0 }
        ];

    var loader = new THREE.OBJLoader();
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P0';
        obj.scale.set(0.005,0.005,0.005);
        addGuidance(obj,0x0000ff);
        players[0].ship = obj;
        MovingScene.add(obj);
    });
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P1';
        obj.scale.set(0.005,0.005,0.005);
        addGuidance(obj,0x00ff00);
        players[1].ship = obj;
        MovingScene.add(obj);
    });
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P2';
        obj.scale.set(0.005,0.005,0.005);
        addGuidance(obj,0xffff00);
        players[2].ship = obj;
        MovingScene.add(obj);
    });
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P3';
        obj.scale.set(0.005,0.005,0.005);
        addGuidance(obj,0xff0000);
        players[3].ship = obj;
        MovingScene.add(obj);
    });

    MovingScene.animate = function(delta) {
        for (var i = 0; i < 4; i++) {
            players[i].cD--;
            if (i < 3) {
                if (players[i].up)      players[i].yVel = Math.min(players[i].yVel + deltaSpeed, maxVelocity);
                if (players[i].left)    players[i].xVel = Math.max(players[i].xVel - deltaSpeed, -maxVelocity);
                if (players[i].down)    players[i].yVel = Math.max(players[i].yVel - deltaSpeed, -maxVelocity);
                if (players[i].right)   players[i].xVel = Math.min(players[i].xVel + deltaSpeed, maxVelocity);
                if (players[i].action && players[i].cD <= 0) {
                    this.fires.push(new Fire(players[i].ship.position, {x:0,y:0,z:-1000}));
                    players[i].cD = coolDown;
                }
            }
            else { // Create safe spot for slow down           Add acceleration
                if (Math.abs(mouse.x)>0.1) players[i].xVel += Math.max(Math.min(mouse.x*2, deltaSpeed), -deltaSpeed);
                if (Math.abs(mouse.y)>0.1) players[i].yVel += Math.max(Math.min(mouse.y*2, deltaSpeed), -deltaSpeed);
                players[i].xVel = Math.max(Math.min(players[i].xVel, maxVelocity), -maxVelocity);//max speed
                players[i].yVel = Math.max(Math.min(players[i].yVel, maxVelocity), -maxVelocity);
                if (mouse.t && players[i].cD <= 0) {
                    this.fires.push(new Fire(players[i].ship.position, {x:0,y:0,z:-1000}));
                    players[i].cD = coolDown;
                }
            }

            if (players[i].ship) {
                if (players[i].ship.position.x >= xBoundBox) {// && players[i].xVel>-maxVelocity/2
                    players[i].xVel -= 2 * deltaSpeed;// * (players[i].ship.position.x - xBoundBox);
                    players[i].xVel *= 0.9;
                }
                else if (players[i].ship.position.x <= -xBoundBox ) {//&& players[i].xVel<maxVelocity/2
                    players[i].xVel += 2 * deltaSpeed;// * -(players[i].ship.position.x + xBoundBox);
                    players[i].xVel *= 0.9;
                }
                if (players[i].ship.position.y >= yBoundBox) {// && players[i].yVel>-maxVelocity/2
                    players[i].yVel -= 2 * deltaSpeed;// * (players[i].ship.position.y - yBoundBox);
                    players[i].yVel *= 0.9;
                }
                else if (players[i].ship.position.y <= -yBoundBox) {// && players[i].yVel<maxVelocity/2
                    players[i].yVel += 2 * deltaSpeed;// * -(players[i].ship.position.y + yBoundBox);
                    players[i].yVel *= 0.9;
                }
                players[i].ship.position.x += players[i].xVel;
                players[i].ship.position.y += players[i].yVel;
                //auto slow down
                players[i].xVel = players[i].xVel>0 ? (players[i].xVel<0.0002  ? 0 : players[i].xVel-0.0002):
                                                      (players[i].xVel>-0.0002 ? 0 : players[i].xVel+0.0002);
                players[i].yVel = players[i].yVel>0 ? (players[i].yVel<0.0002  ? 0 : players[i].yVel-0.0002):
                                                      (players[i].yVel>-0.0002 ? 0 : players[i].yVel+0.0002);
            }
        }
        this.fires.forEach(function (e, i, arr) {
            e.animate();
            if (!e.active)
                arr.splice(i, 1);
        });
    };

    var maxVelocity = 0.1, deltaSpeed = 0.001, xBoundBox = 1.2, yBoundBox = 0.8;
    MovingScene.input = function(key, player, ipt) {
        players[player][ipt] = key;
    }
};


var Fire = function (start, end) {
    var newSphere= new THREE.MeshPhongMaterial();
    newSphere.map           = new THREE.TextureLoader().load('img/planetmin/30d.jpg');
    newSphere.bumpMap      = new THREE.TextureLoader().load('img/planetmin/30n.jpg');
    newSphere.bumpScale    = 1;
    var obj = new THREE.Mesh(new THREE.CubeGeometry(3, 3, 3), newSphere);
    //var obj = new THREE.Mesh(new THREE.SphereGeometry(3, 3, 3), new THREE.MeshNormalMaterial());
    var speed = 0.01;
    this.active = true;
    this.name = 'fire' + Math.random();
    var amp = 10;

    obj.name = this.name;
    obj.position.x = start.x;
    obj.position.y = start.y;
    obj.position.z = start.z;
    MovingScene.add(obj);

    this.animate = function () {
        obj.position.x += speed * end.x;
        obj.position.y += speed * end.y;
        obj.position.z += speed * end.z;
        if (collision(obj.position, end)) {
            MovingScene.remove(MovingScene.getObjectByName(this.name));
            this.active = false;
        }
    };

    var collision = function () {
        if (obj.position.z < end.z + amp && obj.position.z > end.z - amp)
            return (true);
        /*if (obj.position.x > end.x - amp && obj.position.x < end.x + amp &&
            obj.position.y > end.y - amp && obj.position.y < end.y + amp &&
            obj.position.z > end.z - amp && obj.position.z < end.z + amp)
            return (true);
        else
            return (false);*/
    }
};

function addGuidance(obj,color) {
    var lightsprite0 = getSimpleSprite(color, 32);
    var light0 = new THREE.Object3D();
    light0.position.x = 4;
    light0.position.z = -20;
    light0.add(lightsprite0);
    obj.add(light0);
    var lightsprite1 = getSimpleSprite(color, 32);
    var light1 = new THREE.Object3D();
    light1.position.x = 4;
    light1.position.z = 20;
    light1.add(lightsprite1);
    obj.add(light1);
}