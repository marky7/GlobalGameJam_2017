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
var curLevel = 0, score = 0;

var NOW;
function Now() {
    NOW = new Date().getTime()/1000;
    return 1*NOW;
}

function HideAll() {
    controls.reset();
    NewScene.visible = false;
    MovingScene.visible = false;
    system.visible = false;
    Axoaya.visible = false;
}

// Global Start Checker
var Start = false;

function init() {
    var startLevel = Now();
        // SCENE
    scene = new THREE.Scene();
    guisc = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.05, FAR = 1000000;
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
    //THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
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

    MovingScene.init();
    //MovingScene.show();
    Axoaya.init();
    Axoaya.show();


    //SoundManager2
    Play('AN9');/*TOREMOVE*///Mute();
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
var refreshSpeedCounter = 0;
var speedGame = 40;
var generatePosition = 'large';
function update() {
    refreshcounter++;
    refreshSpeedCounter++;

    if (refreshcounter>=60) { //refill ammunition every seconds
        refreshcounter = 0;
        MovingScene.recharge();
    }

    if (refreshSpeedCounter >= speedGame){
        refreshSpeedCounter = 0;
        if(generatePosition == 'middle'){
            generatePosition = 'large';
            generateAsteroids({rangeX:[-2,2],rangeY:[-1.5,1.5],z0:-100,z1:2,curLevel:curLevel,levels:levels,scene:MovingScene});
        } else if(generatePosition === 'large'){
            generatePosition = 'middle';
            generateAsteroids({rangeX:[-4,4],rangeY:[-3,3],z0:-100,z1:2,curLevel:curLevel,levels:levels,scene:MovingScene});
        }
    }

    // execute stored delayed function
    delayer.launch();

    var delta = clock.getDelta();

    //Animate scenes according to their visibility and the time delta
    if (NewScene.visible) {
        NewScene.animate(delta);
    }
    if (MovingScene.visible) {
        MovingScene.animate(delta);
    }
    if (system.visible) {
        system.rotate(delta);
    }
    if (Axoaya.visible) {
        Axoaya.animate(delta);
    }

    removeEnemies(MovingScene);
    moveEnemies();
    removeBonus(MovingScene);
    moveBonus();
    //shipCollision();
    detectCollisions();

    updateScore();
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


var updateStep = [1000,2000,4000,7000,10000,12000,15000,18000,21000,30000,40000,50000];
var curUpdateStep = 0;
function updateScore(){
    if(updateStep[curUpdateStep] && (score > updateStep[curUpdateStep])){
        curUpdateStep++;
        console.log(speedGame);
        speedGame -= 1; // encrease asteroid creation
    }
    score +=(1*(curLevel+1));
    document.getElementById('score').innerHTML = 'Score : '+score+'<br> Niveau : '+(curLevel+1);

}

// Cette Méthode ne fonctionne qu'avec des ennemis ayant un radius (spheres..)
// le radius du vaisseaux est pour le moment passé en dur : 50px
function shipCollision(){
    for(var i=0; i<players.length; i++){
        for(var j=0; j<enemies.length; j++){
            // Calculer la distance entre les deux centres de gravités
            // AB=racine((xB−xA)2+(yB−yA)2+(zB−zA)2);
            var AB = Math.sqrt(Math.pow(enemies[j].position.x-players[i].ship.position.x, 2)+Math.pow(enemies[j].position.y-players[i].ship.position.y,2)+Math.pow(enemies[j].position.z-players[i].ship.position.z,2));
            if(enemies[j].geometry.parameters.radius && (AB<(enemies[j].geometry.parameters.radius))){
                console.log(" Player "+i+' est mort. name : '+players[i].ship.name);

            }
        }
    }
}

var detedcted = false;
function detectCollisions(){

    // Detecter les collisions entre Les enemies et les vaisseaux afin de détruire les vaisseaux
    for(var i=0; i<enemies.length; i++){
        var curEnemyKilled = false;

        // Detecter collision entre astéroides et vaisseaux
        for(var j=0; j<players.length; j++){//if (i==0 && j==0) console.log((Math.pow(enemies[i].position.x-players[j].ship.position.x, 2)+Math.pow(enemies[i].position.y-players[j].ship.position.y,2)),Math.pow(enemies[i].geometry.parameters.radius, 2));
            if (enemies[i].position.z>-0.2 && !players[j].isDead) {
            // Calculer la distance entre les deux centres de gravités
            // AB=racine((xB−xA)2+(yB−yA)2+(zB−zA)2);
            var AB = Math.pow(enemies[i].position.x-players[j].ship.position.x, 2)+Math.pow(enemies[i].position.y-players[j].ship.position.y,2);
            if(enemies[i].geometry.parameters.radius && AB<(Math.pow(enemies[i].geometry.parameters.radius, 2)+0.1)){
                console.log(" Player "+j+' est mort. name : '+players[j].ship.name);
                // Supprimer le vaisseau du tableau TODO
                players[j].ship.visible = false;
                players[j].isDead = true;
                if (players[0].isDead && players[1].isDead && players[2].isDead && players[3].isDead)
                    GAMEOVER();
                break;
            }}
        }


        // Detecter les collision entre les missiles et les astéroides ICI afin de détruire les astéroides
        for(var k=0; k<missils.length; k++){
            // Calculer la distance entre les deux centres de gravités
            // AB=racine((xB−xA)2+(yB−yA)2+(zB−zA)2);
            var AB = Math.pow(enemies[i].position.x - missils[k].position.x, 2) + Math.pow(enemies[i].position.y - missils[k].position.y,2) + Math.pow(enemies[i].position.z-missils[k].position.z,2);

            if(enemies[i].geometry.parameters.radius && (AB<Math.pow(enemies[i].geometry.parameters.radius, 2))){

                // console.log(" Ennemi "+i+' est mort. name : '+enemies[i].name);
                // console.log(" Missil "+k+' est detruit. name : '+missils[k].name);
                // Supprimer les objets des tableaux TODO
                MovingScene.remove(MovingScene.getObjectByName(missils[k].name));
                missils.splice(k,1);
                k--;
                // Supprimer les objets de la scene TODO
                curEnemyKilled = true;
                break;
            }
        }
        if(curEnemyKilled){
            MovingScene.remove(MovingScene.getObjectByName(enemies[i].name));
            enemies.splice(i,1);
            i--;
            curEnemyKilled = false;
        }

    }
/*
    // Detecter collision entre les bonus et les vaisseaux
    for(var l=0; l<bonus.length; l++){
        for(var m=0; m<players.length; m++){
            // Calculer la distance entre les deux centres de gravités
            // AB=racine((xB−xA)2+(yB−yA)2+(zB−zA)2);
            var AB = Math.pow(bonus[l].position.x-players[m].ship.position.x, 2) + Math.pow(bonus[l].position.y - players[m].ship.position.y,2) + Math.pow(bonus[l].position.z-players[m].ship.position.z,2);
            if(bonus[l].children[1].geometry.parameters.radius && (AB<Math.pow(bonus[l].children[1].geometry.parameters.radius,2))){
                //console.log(" Player "+m+' a reçu un Bonus. Bonus name : '+bonus[m].name);
                // score += 1000; // Give a score bonus to player
                // Supprimer le Bonus du tableau TODO
                // Supprimer le Bonus de la scène TODO
            }
        }
    }*/
}
