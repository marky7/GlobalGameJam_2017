var lightMapShader = {

    vertexShader: [

    //**"varying vec2 vUv;",
    "varying vec3 vNormal;",

    "void main() {",
        //**"vUv = uv;",
        "vNormal = normal;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

    ].join("\n"),

    fragmentShader: [

    "uniform sampler2D texture;",
    "uniform float size;",
    //**"varying vec2 vUv;",
    "varying vec3 vNormal;",
    "void main() {",

        "vec2 vUv = normalize( vNormal ).xy * size + 0.5;",

        "vec4 color = texture2D(texture, vUv);",
        "gl_FragColor = color;",

    "}"


    ].join("\n")
};

var particuleShader = {

    vertexShader: [

    "attribute vec3 customColor;",
    "attribute float customItsty;",
    "varying vec3 vColor;",

    "void main() {",

        "vColor = customColor;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "gl_PointSize = customItsty * ( 300.0 / length( mvPosition.xyz ) );",
        "gl_Position = projectionMatrix * mvPosition;",

    "}"

    ].join("\n"),

    fragmentShader: [

    "uniform sampler2D texture;",
    "varying vec3 vColor;",

    "void main() {",

        "gl_FragColor = vec4( vColor, 1.0 );",
        "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",

    "}"


    ].join("\n")
};

var StarShader = {

    vertexShader: [

    //"uniform float amplitude;",
    "attribute float size;",
    "attribute vec3 customColor;",

    "varying vec3 vColor;",

    "void main() {",

        "vColor = customColor;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );",
        "gl_Position = projectionMatrix * mvPosition;",

    "}"

    ].join("\n"),

    fragmentShader: [

    "uniform vec3 color;",
    "uniform sampler2D texture;",

    "varying vec3 vColor;",

    "void main() {",

        "gl_FragColor = vec4( vColor, 1.0 );",
        "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",

    "}"


    ].join("\n")
};

var IconShader = {

    vertexShader: [

    "uniform vec3 color;",
    "attribute float size;",
    "attribute float texture;",

    "varying vec3 vColor;",
    "varying float vtext;",

    "void main() {",

        "vColor = color;",
        "vtext = texture;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "gl_PointSize = size * ( 1.0 );",
        "gl_Position = projectionMatrix * mvPosition;",

    "}"

    ].join("\n"),

    fragmentShader: [

    "uniform vec3 color;",
    "uniform sampler2D text0;",
    "uniform sampler2D text1;",
    "uniform sampler2D text2;",
    "varying float vtext;",

    "varying vec3 vColor;",

    "void main() {",

        "gl_FragColor = vec4( vColor, 1.0 );",
        "if (vtext<0.5)      { gl_FragColor = gl_FragColor * texture2D( text0, gl_PointCoord ); }",
        "else if (vtext<1.5) { gl_FragColor = gl_FragColor * texture2D( text1, gl_PointCoord ); }",
        "else                { gl_FragColor = gl_FragColor * texture2D( text2, gl_PointCoord ); }",
    "}"


    ].join("\n")
};

var StarSurface = {

    vertexShader: [

	"varying vec2 vUv;",
	"varying vec3 vNormal;",
	"void main() {",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"vNormal = normalize( normalMatrix * normal );",
		"vUv = uv;",
	"}"

    ].join("\n"),

    fragmentShader: [

	"varying vec2 vUv;",
	"varying vec3 vNormal;",
	"uniform sampler2D texturePrimary;",
	"uniform sampler2D textureColor;",
	"uniform sampler2D textureSpectral;",
	"uniform float time;",
	"uniform float spectralLookup;",

	"void main() {",
	    "float uvMag = 2.0;",
	    "float paletteSpeed = 0.2;",
	    "float minLookup = 0.2;",
	    "float maxLookup = 0.98;",

	    //  let's double up on the texture to make the sun look more detailed
	    "vec2 uv = vUv * uvMag;",

	    //  do a lookup for the texture now, but hold on to its gray value
	    "vec3 colorIndex = texture2D( texturePrimary, uv ).xyz;",
	    "float lookupColor = colorIndex.x;",

	    //  now cycle the value, and clamp it, we're going to use this for a second lookup
	    "lookupColor = fract( lookupColor - time * paletteSpeed );",
	    "lookupColor = clamp(lookupColor, minLookup, maxLookup );",

	    //  use the value found and find what color to use in a palette texture
	    "vec2 lookupUV = vec2( lookupColor, 0. );",
	    "vec3 foundColor = texture2D( textureColor, lookupUV ).xyz;",

	    //  now do some color grading
	    "foundColor.xyz *= 0.6;",
	    "foundColor.x = pow(foundColor.x, 2.);",
	    "foundColor.y = pow(foundColor.y, 2.);",
	    "foundColor.z = pow(foundColor.z, 2.);",

	    "foundColor.xyz += vec3( 0.6, 0.6, 0.6 ) * 1.4;",
	    //foundColor.xyz += vec3(0.6,0.35,0.21) * 2.2;

	    "float spectralLookupClamped = clamp( spectralLookup, 0., 1. );",
	    "vec2 spectralLookupUV = vec2( 0., spectralLookupClamped );",
	    "vec4 spectralColor = texture2D( textureSpectral, spectralLookupUV );    ",

	    "spectralColor.x = pow( spectralColor.x, 2. );",
	    "spectralColor.y = pow( spectralColor.y, 2. );",
	    "spectralColor.z = pow( spectralColor.z, 2. );",

	    "foundColor.xyz *= spectralColor.xyz;    ",
	    

	    //  apply a secondary, subtractive pass to give it more detail
	    //  first we get the uv and apply some warping
	    "vec2 uv2 = vec2( vUv.x + cos(time) * 0.001, vUv.y + sin(time) * 0.001 );",
	    "vec3 secondaryColor = texture2D( texturePrimary, uv2 ).xyz;",

	    //  finally give it an outer rim to blow out the edges
	    "float intensity = 1.15 - dot( vNormal, vec3( 0.0, 0.0, 0.3 ) );",
	    "vec3 outerGlow = vec3( 1.0, 0.8, 0.6 ) * pow( intensity, 6.0 );",

	    "vec3 desiredColor = foundColor + outerGlow - secondaryColor;",
	    "float darkness = 1.0 - clamp( length( desiredColor ), 0., 1. );",
	    "vec3 colorCorrection = vec3(0.7, 0.4, 0.01) * pow(darkness,2.0) * secondaryColor;",
	    "desiredColor += colorCorrection;",

	    //  the final composite color
	    "gl_FragColor = vec4( desiredColor, 1.0 );",
	"}"


    ].join("\n")
};

var StarCorona = {

    vertexShader: [

	"varying vec2 vUv;",
	"void main() {",
		"vUv = uv;",
		"float rotation = 0.0;",
		'vec2 alignedPosition = position.xy;',

		'vec2 rotatedPosition;',
		'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
		'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

		'vec4 finalPosition;',

		'finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
		'finalPosition.xy += rotatedPosition;',
		'finalPosition = projectionMatrix * finalPosition;',

		'gl_Position = finalPosition;',	
		//"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		//"vUv = uv;",
	"}"

    ].join("\n"),

    fragmentShader: [

	"varying vec2 vUv;",
	
	"uniform sampler2D texturePrimary;",
	
	"uniform float spectralLookup;",
	"uniform sampler2D textureSpectral;",
	
	"void main() {",
		"vec2 uv = vUv;",
		
		"vec4 foundColor = texture2D( texturePrimary, uv );",
		"foundColor.x *= 1.2;",//1.4
		"foundColor.y *= 1.2;",//1.2
		"foundColor.z *= 1.2;",//0.7
		//foundColor.xyz *= 10.0;
		"foundColor = clamp( foundColor, 0., 1. );	",
	
		"float spectralLookupClamped = clamp( spectralLookup, 0., 1. );",
		"vec2 spectralLookupUV = vec2( 0., spectralLookupClamped );",
		"vec4 spectralColor = texture2D( textureSpectral, spectralLookupUV );	",
	
		"spectralColor.x = pow( spectralColor.x, 2. );",
		"spectralColor.y = pow( spectralColor.y, 2. );",
		"spectralColor.z = pow( spectralColor.z, 2. );",
	
		"spectralColor.xyz += 0.2;",
	
		"vec3 finalColor = clamp( foundColor.xyz * spectralColor.xyz * 1.4 , 0., 1.);",
	
		"gl_FragColor = vec4( finalColor, 1.0 );",
	
	"}"

    ].join("\n")
};

var StarHalo = {

    vertexShader: [

	"varying vec2 vUv;",
	"void main() {",
			"vUv = uv;",
			"float rotation = 0.0;",
			'vec2 alignedPosition = position.xy;',

			'vec2 rotatedPosition;',
			'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
			'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

			'vec4 finalPosition;',

			'finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
			'finalPosition.xy += rotatedPosition;',
			'finalPosition = projectionMatrix * finalPosition;',

			'gl_Position = finalPosition;',	
		//"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		//"vUv = uv;",
	"}"

    ].join("\n"),

    fragmentShader: [

	"varying vec2 vUv;",
	"uniform sampler2D texturePrimary;",
	"uniform sampler2D textureColor;",
	"uniform float time;",

	"uniform float spectralLookup;",
	"uniform sampler2D textureSpectral;",

	"void main() {",
		"vec3 colorIndex = texture2D( texturePrimary, vUv ).xyz;",
		"float lookupColor = colorIndex.x;",
		"lookupColor = fract( lookupColor + time * 0.04 );",
		"lookupColor = clamp(lookupColor,0.2,0.98);",
		"vec2 lookupUV = vec2( lookupColor, 0. );",
		"vec3 foundColor = texture2D( textureColor, lookupUV ).xyz;",

		"foundColor.xyz += 0.4;",
		"foundColor *= 10.0;",

		"float spectralLookupClamped = clamp( spectralLookup, 0., 1. );",
		"vec2 spectralLookupUV = vec2( 0., spectralLookupClamped );",
		"vec4 spectralColor = texture2D( textureSpectral, spectralLookupUV );	",

		"spectralColor.x = pow( spectralColor.x, 3. );",
		"spectralColor.y = pow( spectralColor.y, 3. );",
		"spectralColor.z = pow( spectralColor.z, 3. );",

		"gl_FragColor = vec4( foundColor * colorIndex * spectralColor.xyz , 1.0 );",
	"}"

    ].join("\n")
};