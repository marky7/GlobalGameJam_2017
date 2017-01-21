// standard global variables
var container, scene, camera, renderer, controls, stats;
// gui  variables
var guisc, guicam;
// ovre gui variables
var canvas,  ctx, overtext, overimg, OverSel = -1;
// over variables
var INTERSECTED,INTERSECSEL;
// time managment
var clock = new THREE.Clock();

var NOW;
function Now() {
    NOW = new Date().getTime()/1000;
    return 1*NOW;
}

function HideAll() {
    controls.reset();
    NewScene.visible = false;
    system.visible = false;
    Axoaya.visible = false;
}

// Global Start Checker
var Start = false;
       
function init() { 
    // SCENE
    scene = new THREE.Scene();
    guisc = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.05, FAR = 1000000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,2,5);
    camera.lookAt(scene.position);  

    guicam = new THREE.OrthographicCamera( -SCREEN_WIDTH /2, SCREEN_WIDTH /2, SCREEN_HEIGHT /2, -SCREEN_HEIGHT /2, 1, 10 );
    guicam.position.z = 10;

    renderer = new THREE.WebGLRenderer( {antialias:true,precision:"lowp"} );
    //else
    //    renderer = new THREE.CanvasRenderer(); 
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.autoClear = false; // important for double render
    container = document.getElementById( 'ThreeJS' );
    container.appendChild( renderer.domElement );
    // EVENTS
    THREEx.WindowResize(renderer, camera, false);
    THREEx.WindowResize(renderer, guicam, true );
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '4px';
    stats.domElement.style.left = '320px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );
    
    //CANVAS INIT
    // create a canvas element
    canvas = document.createElement('canvas');
    canvas.width  = 512;
    canvas.height = 512;
    ctx = canvas.getContext('2d');
    ctx.font = "Bold 20px Arial";
    ctx.fillStyle = "rgba(0,0,0,0.80)";
    ctx.fillText(' ', 0, 20);
    
    // canvas over texture
    overtext = new THREE.Texture(canvas);
    overtext.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial( { map: overtext/*, useScreenCoordinates: true*/ } );
    overimg = new THREE.Sprite( spriteMaterial );
    overimg.scale.set(512,512,1.0);
    overimg.position.set( 0, 0, 0 );
    guisc.add( overimg );

    HideAll();

    NewScene.init();
    //NewScene.show();

    InitSystem();
    //ShowSystem();

    Axoaya.init();
    Axoaya.show();

    //SoundManager2
    Play();/*TOREMOVE*/Mute();
}

//!MAIN ENGINE LOOP!
function animate() 
{   
    update(); 
    render();  
    requestAnimationFrame( animate );
}

//store all function that must be launch on next frame
var UpdateNext = [];
//limit the GUI refresh when nothing happen
var refreshcounter = 0;
function update()
{
    refreshcounter++;
    if (refreshcounter>=30) { //GUI only draw every 0.5 sec
        refreshcounter = 0;
        if (GUI) GUI.Draw();
    }

    // execute stored delayed function
    delayer.launch();

    var delta = clock.getDelta();

    //Animate scenes according to their visibility and the time delta
    if (NewScene.visible) {
        NewScene.animate(delta);
    }
    if (system.visible) {
        system.rotate(delta);
    }
    if (Axoaya.visible) {
        Axoaya.animate(delta);
    }
    //refresh cam control and fps display
    controls.update();
    stats.update();
}

function render() 
{   //please dont make anything stupid here
    renderer.clear();                               //Reset to a black screen   
    renderer.render( scene, camera );               //Render all 3D stuff
    if ( Detector.webgl ) renderer.clearDepth();
    renderer.render( guisc, guicam );               //Render the 2D GUI
}  
