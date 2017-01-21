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

    var cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
	cube.position.y = 150;
	MovingScene.add(cube);

    MovingScene.animate = function(delta) {
        //MovingScene.rotation.y -= 0.02*delta;
        if (playerInput[0].up)      yVelocity += deltaSpeed;
        if (playerInput[0].left)    xVelocity -= deltaSpeed;
        if (playerInput[0].down)    yVelocity -= deltaSpeed;
        if (playerInput[0].right)   xVelocity += deltaSpeed;

        cube.position.x += xVelocity;
        cube.position.y += yVelocity;
        console.log(xVelocity,yVelocity);
        //camera.position = cube.position;
    };

    var xVelocity = 0, yVelocity = 0, maxVelocity = 10, deltaSpeed = 1;
    var keyDown = false, lastKey = '';
    var playerInput = [{
        'up' : false,
        'left' : false,
        'down' : false,
        'right' : false
    }];
    MovingScene.input = function(keyup,player,ipt) {
        
        playerInput[player][ipt] = keyup;
        /*switch (ipt) {
            case 'p1u':
                lastKey = 'p1u';
                keyDown = true;
                break;
            case 'p1l':
                lastKey = 'p1l';
                keyDown = true;
                break;
            case 'p1d':
                lastKey = 'p1d';
                keyDown = true;
                break;
            case 'p1r':
                lastKey = 'p1r';
                keyDown = true;
                break;
            default:
                break;
        }
        if (['u1p', 'l1p', 'd1p', 'r1p'].indexOf(ipt) >= 0)
            keyDown = false;*/
    }
};