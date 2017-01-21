var MovingScene = new THREE.Object3D();

MovingScene.show = function() { if (!MovingScene.visible) {
    HideAll();
    controls.minDistance =  250;
    controls.maxDistance = 10000;
    controls.userPanSpeed = 4;
    camera.position.set(0,1500,2000);
    controls.center.set(0,0,0);
    controls.traveling(new THREE.Vector3(),2500);
    MovingScene.visible = true;
}};

MovingScene.init = function() {
    scene.add(MovingScene);

    var alight = new THREE.AmbientLight(0x888888);
    MovingScene.add(alight);

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

    var players = [{
        up: false,
        left: false,
        down: false,
        right: false,
        xVel: 0,
        yVel: 0
    }, {
        up: false,
        left: false,
        down: false,
        right: false,
        xVel: 0,
        yVel: 0
    }, {
        up: false,
        left: false,
        down: false,
        right: false,
        xVel: 0,
        yVel: 0
    }, {
        up: false,
        left: false,
        down: false,
        right: false,
        xVel: 0,
        yVel: 0
    }];

    for (var i = 0; i < 4; i++) {
        players[i].mesh = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
        players[i].mesh.position.y = 150;
        MovingScene.add(players[i].mesh);
    }

    var bufferMouse = { xp: mouse.xp, yp: mouse.yp };
    MovingScene.animate = function(delta) {
        if (mouse.xp != bufferMouse.xp || mouse.yp != bufferMouse.yp) {
            if (bufferMouse.yp < mouse.yp) {
                players[3].down = true;
                players[3].up = false;
            }
            else if (bufferMouse.yp > mouse.yp) {
                players[3].down = false;
                players[3].up = true;
            }
            if (bufferMouse.xp < mouse.xp) {
                players[3].left = false;
                players[3].right = true;
            }
            else if (bufferMouse.xp > mouse.xp) {
                players[3].left = true;
                players[3].right = false;
            }
        }
        bufferMouse.xp = mouse.xp;
        bufferMouse.yp = mouse.yp;
        for (var i = 0; i < 4; i++) {
            if (players[i].up)      players[i].yVel += deltaSpeed;
            if (players[i].left)    players[i].xVel -= deltaSpeed;
            if (players[i].down)    players[i].yVel -= deltaSpeed;
            if (players[i].right)   players[i].xVel += deltaSpeed;

            players[i].mesh.position.x += players[i].xVel;
            players[i].mesh.position.y += players[i].yVel;
        }
    };

    var maxVelocity = 10, deltaSpeed = 1;
    MovingScene.input = function(key,player,ipt) {
        players[player][ipt] = key;
    }
};