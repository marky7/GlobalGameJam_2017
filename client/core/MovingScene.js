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

    MovingScene.animate = function(delta) {
        for (var i = 0; i < 4; i++) {
            if (i < 3) {
                if (players[i].up)      players[i].yVel = Math.min(players[i].yVel + deltaSpeed, maxVelocity);
                if (players[i].left)    players[i].xVel = Math.max(players[i].xVel - deltaSpeed, -maxVelocity);
                if (players[i].down)    players[i].yVel = Math.max(players[i].yVel - deltaSpeed, -maxVelocity);
                if (players[i].right)   players[i].xVel = Math.min(players[i].xVel + deltaSpeed, maxVelocity);
            }
            else {
                players[i].xVel = Math.max(Math.min(mouse.x * 5, 1), -1) * maxVelocity;
                players[i].yVel = Math.max(Math.min(mouse.y * 5, 1), -1) * maxVelocity;
            }

            players[i].mesh.position.x += players[i].xVel;
            players[i].mesh.position.y += players[i].yVel;
        }
    };

    var maxVelocity = 20, deltaSpeed = 1;
    MovingScene.input = function(key,player,ipt) {
        players[player][ipt] = key;
    }
};