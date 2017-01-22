var levels = [];

levels[0] = {
    cubes : [
       {textureUrl:'img/planetmin/51d.jpg',speed:150,boxGeometry:[55,55,100]}
        ],
    spheres : [
       {bumpScale:1,mapUrl:'./img/planetmin/10d.jpg',bumpMapUrl:'./img/planetmin/10n.jpg',speed:150,sphereGeometry:[250,20,20]},
        {ratioMT:0.9,bumpScale:1,mapUrl:'./img/planetmin/18d.jpg',bumpMapUrl:'./img/planetmin/18n.jpg',speed:150,sphereGeometry:[200,20,20]},
        {ratioLT:0.3,bumpScale:1,mapUrl:'./img/planetmin/18d.jpg',bumpMapUrl:'./img/planetmin/18n.jpg',speed:150,sphereGeometry:[300,20,20]},
       {ratioMT:0.95,bumpScale:1,mapUrl:'./img/planetmin/24d.jpg',bumpMapUrl:'./img/planetmin/24n.jpg',speed:150,sphereGeometry:[450,20,20]}
    ],bonus : [
        {ratioLT:0.09,speed:170,meshPhongColor:'0xffffff',meshBasicColor:'0xFFBB00',height:70},
        {ratioLT:0.7,speed:170,meshPhongColor:'#2222ff',meshBasicColor:'#33BBFF',height:100}
    ]
};

levels[1] = {
    cubes : [
        {ratioLT:0.5,textureUrl:'img/planetmin/18d.jpg',speed:300,boxGeometry:[55,55,300]}
        // {ratioLT:0.5,textureUrl:'img/planetmin/18d.jpg',speed:300,boxGeometry:[200,200,200]}
    ],
    spheres : [
        {ratioLT:1,bumpScale:1,mapUrl:'./img/planetmin/27d.jpg',bumpMapUrl:'./img/planetmin/27n.jpg',speed:260,sphereGeometry:[250,20,20]},
        {ratioMT:0.9,bumpScale:1,mapUrl:'./img/planetmin/24d.jpg',bumpMapUrl:'./img/planetmin/24n.jpg',speed:260,sphereGeometry:[400,20,20]},
        {ratioLT:0.001,bumpScale:1,mapUrl:'./img/planetmin/10d.jpg',bumpMapUrl:'./img/planetmin/10n.jpg',speed:260,sphereGeometry:[500,20,20]},
        {bumpScale:1,mapUrl:'./img/planetmin/10d.jpg',bumpMapUrl:'./img/planetmin/8n.jpg',speed:260,sphereGeometry:[400,20,20]}
    ],bonus : [
        {randomLT:0.07,speed:270,meshPhongColor:'#ffff00',meshBasicColor:'#FFDD00',height:70},
        {ratioMT:0.97,speed:170,meshPhongColor:'#2222ff',meshBasicColor:'#33BBFF',height:100}

    ]
};
