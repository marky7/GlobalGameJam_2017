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
    scene.add(MovingScene);

    var alight = new THREE.AmbientLight(0x888888);
    MovingScene.add(alight);
    var lollight = new THREE.AmbientLight(0xffffff);
    MovingScene.add(lollight);
    var plight = new THREE.PointLight(0x888888);
        plight.position.z = 1000;
    MovingScene.add(plight);

    MovingScene.fires = [];

    MovingScene.background = new THREE.CubeTextureLoader()
        .setPath( 'img/starbox/' )
        .load( [ 's_px.jpg', 's_nx.jpg', 's_py.jpg', 's_ny.jpg', 's_pz.jpg', 's_nz.jpg' ] );
    scene.background = MovingScene.background;

    var focusMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.ImageUtils.loadTexture( './img/focus.jpg',{}, function() { guisc.add(MovingScene.focusSprite); } ),
            useScreenCoordinates: false,
            color: 0xffffff,
            transparent: false,
            blending: THREE.AdditiveBlending
        });
    MovingScene.focusSprite = new THREE.Sprite( focusMaterial );
    MovingScene.focusSprite.scale.set(256, 256, 1.0);
    MovingScene.focusSprite.position.setX(12);
    MovingScene.focusSprite.visible = false;

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
        players[0].ship = obj;
        MovingScene.add(obj);
    });
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P1';
        players[1].ship = obj;
        MovingScene.add(obj);
    });
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P2';
        players[2].ship = obj;
        MovingScene.add(obj);
    });
    loader.load('0', function (obj) {
        obj.rotation.y = -90 / 180 * Math.PI;
        obj.name = 'P3';
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
            else {
                players[i].xVel = Math.max(Math.min(mouse.x * 5, 1), -1) * maxVelocity;
                players[i].yVel = Math.max(Math.min(mouse.y * 5, 1), -1) * maxVelocity;
                if (mouse.t && players[i].cD <= 0) {
                    this.fires.push(new Fire(players[i].ship.position, {x:0,y:0,z:-1000}));
                    players[i].cD = coolDown;
                }
            }

            if (players[i].ship) {
                if (players[i].ship.position.x >= xBoundBox)
                    players[i].xVel -= 0.1 * deltaSpeed * (players[i].ship.position.x - xBoundBox);
                else if (players[i].ship.position.x <= -xBoundBox)
                    players[i].xVel += 0.1 * deltaSpeed * -(players[i].ship.position.x + xBoundBox);
                if (players[i].ship.position.y >= yBoundBox)
                    players[i].yVel -= 0.1 * deltaSpeed * (players[i].ship.position.y - yBoundBox);
                else if (players[i].ship.position.y <= -yBoundBox)
                    players[i].yVel += 0.1 * deltaSpeed * -(players[i].ship.position.y + yBoundBox);
                players[i].ship.position.x += players[i].xVel;
                players[i].ship.position.y += players[i].yVel;
            }
        }
        this.fires.forEach(function (e, i, arr) {
            e.animate();
            if (!e.active)
                arr.splice(i, 1);
        });
    };

    var maxVelocity = 7, deltaSpeed = 1, xBoundBox = 340, yBoundBox = 150;
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