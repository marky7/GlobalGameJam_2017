var levels = [];
var levelsMat = [];

levelsMat[0] = new THREE.MeshLambertMaterial();
levelsMat[0].map  = new THREE.TextureLoader().load('./img/planetmin/10d.jpg');
levelsMat[0].bumpMap = new THREE.TextureLoader().load('./img/planetmin/10n.jpg');
levelsMat[0].bumpScale = 0.001;
levelsMat[1] = new THREE.MeshLambertMaterial();
levelsMat[1].map  = new THREE.TextureLoader().load('./img/planetmin/18d.jpg');
levelsMat[1].bumpMap = new THREE.TextureLoader().load('./img/planetmin/18n.jpg');
levelsMat[1].bumpScale = 0.001;
levelsMat[2] = new THREE.MeshLambertMaterial();
levelsMat[2].map  = new THREE.TextureLoader().load('./img/planetmin/25d.jpg');
levelsMat[2].bumpMap = new THREE.TextureLoader().load('./img/planetmin/25n.jpg');
levelsMat[2].bumpScale = 0.001;

levelsMat[3] = new THREE.MeshLambertMaterial();
levelsMat[3].map  = new THREE.TextureLoader().load('./img/planetmin/27d.jpg');
levelsMat[3].bumpMap = new THREE.TextureLoader().load('./img/planetmin/27n.jpg');
levelsMat[3].bumpScale = 0.001;
levelsMat[4] = new THREE.MeshLambertMaterial();
levelsMat[4].map  = new THREE.TextureLoader().load('./img/planetmin/24d.jpg');
levelsMat[4].bumpMap = new THREE.TextureLoader().load('./img/planetmin/24n.jpg');
levelsMat[4].bumpScale = 0.001;
levelsMat[5] = new THREE.MeshLambertMaterial();
levelsMat[5].map  = new THREE.TextureLoader().load('./img/planetmin/48d.jpg');
levelsMat[5].bumpMap = new THREE.TextureLoader().load('./img/planetmin/48n.jpg');
levelsMat[5].bumpScale = 0.001;
levelsMat[6] = new THREE.MeshLambertMaterial();
levelsMat[6].map  = new THREE.TextureLoader().load('./img/planetmin/43d.jpg');
levelsMat[6].bumpMap = new THREE.TextureLoader().load('./img/planetmin/43n.jpg');
levelsMat[6].bumpScale = 0.001;

var levelSize = 1/50;
levels[0] = {
    cubes : [
        {textureUrl:'img/planetmin/51d.jpg',speed:0.7,boxGeometry:[55,55,100]}
    ],
    spheres : [
        {bumpScale:1,mat:levelsMat[0],speed:0.7,sphereGeometry:[25*levelSize,20,20]},
        {ratioMT:0.9,bumpScale:1,mat:levelsMat[1],speed:0.7,sphereGeometry:[20*levelSize,20,20]},
        {ratioLT:0.3,bumpScale:1,mat:levelsMat[1],speed:0.7,sphereGeometry:[10*levelSize,20,20]},
        {ratioLT:0.1,bumpScale:1,mat:levelsMat[2],speed:0.7,sphereGeometry:[20*levelSize,20,20]}
    ],bonus : [
        {ratioLT:0.1,speed:0.7,meshPhongColor:'0xffffff',meshBasicColor:'0xFFBB00',height:0.1,type:2},
        {ratioMT:0.85,speed:0.7,meshPhongColor:'#2222ff',meshBasicColor:'#33BBFF',height:0.15,type:1}
    ]
};

levels[1] = {
    cubes : [
        {ratioLT:0.5,textureUrl:'img/planetmin/18d.jpg',speed:1,boxGeometry:[55,55,300]}
    ],
    spheres : [
        {ratioLT:1,bumpScale:1,mat:levelsMat[3],speed:1,sphereGeometry:[20*levelSize,20,20]},
        {ratioMT:0.9,bumpScale:1,mat:levelsMat[4],speed:1,sphereGeometry:[40*levelSize,20,20]},
        {ratioLT:0.001,bumpScale:1,mat:levelsMat[0],speed:1,sphereGeometry:[50*levelSize,20,20]},
        {bumpScale:1,mat:levelsMat[0],speed:1,sphereGeometry:[40*levelSize,20,20]},
        {ratioLT:0.02,bumpScale:1,mat:levelsMat[5],speed:1,sphereGeometry:[10*levelSize,20,20]}
    ],bonus : [
        {randomLT:0.06,speed:1,meshPhongColor:'#ffff00',meshBasicColor:'#FFDD00',height:0.17,type:2},
        {ratioMT:0.97,speed:1,meshPhongColor:'#2222ff',meshBasicColor:'#33BBFF',height:0.22,type:1}
    ]
};