var levels = [];

levels[0] = {
    cubes : [
       {textureUrl:'img/planetmin/51d.jpg',speed:350,boxGeometry:[300,300,300]}
        ],
    spheres : [
       {bumpScale:1,mapUrl:'./img/planetmin/10d.jpg',bumpMapUrl:'./img/planetmin/10n.jpg',speed:350,sphereGeometry:[300,20,20]},
       {bumpScale:1,mapUrl:'./img/planetmin/18d.jpg',bumpMapUrl:'./img/planetmin/18n.jpg',speed:350,sphereGeometry:[850,20,20]}
    ],bonus : [
        {ratioLT:0.001,speed:300,meshPhongColor:'0xffffff',meshBasicColor:'0xFFBB00'}
    ]
};

levels[1] = {
    cubes : [
        {ratioLT:0.5,textureUrl:'img/planetmin/18d.jpg',speed:300,boxGeometry:[300,300,300]},
        {ratioLT:0.5,textureUrl:'img/planetmin/18d.jpg',speed:300,boxGeometry:[200,200,200]}
    ],
    spheres : [
        {ratioLT:1,bumpScale:1,mapUrl:'./img/planetmin/27d.jpg',bumpMapUrl:'./img/planetmin/27n.jpg',speed:300,sphereGeometry:[250,20,20]},
        {ratioMT:0.9,bumpScale:1,mapUrl:'./img/planetmin/24d.jpg',bumpMapUrl:'./img/planetmin/24n.jpg',speed:300,sphereGeometry:[500,20,20]},
        {ratioLT:0.02,bumpScale:1,mapUrl:'./img/planetmin/10d.jpg',bumpMapUrl:'./img/planetmin/10n.jpg',speed:300,sphereGeometry:[3000,20,20]},
        {bumpScale:1,mapUrl:'./img/planetmin/10d.jpg',bumpMapUrl:'./img/planetmin/8n.jpg',speed:300,sphereGeometry:[400,20,20]}
    ],bonus : [
        {randomLT:0.0005,speed:300,meshPhongColor:'#ffff00',meshBasicColor:'#FFDD00'}
    ]
};
