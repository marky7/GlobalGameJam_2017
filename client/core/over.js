// =====================
// === GALAXY SECTOR ===
// =====================
function GalaxyOver() {
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	vector.unproject( camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	//var ray = new THREE.Raycaster();
	//	ray.setFromCamera( {"x":mouse.x,"y":mouse.y}, camera );
	//	ray.params.Points.threshold = 4;

	if (NewScene.visible) {
		var intersects = ray.intersectObjects( NewScene.over );	
		if ( intersects.length > 0) {
			NewScene.focusSprite.visible = true;
			NewScene.focusSprite.position.set(12+mouse.xp-window.innerWidth/2,window.innerHeight/2-mouse.yp,1);
			
			ctx.clearRect(0,0,512,512);

			//ctx.drawImage(resources.get("img/focus.jpg"),136,128);
			//ctx.drawImage(resources.get("img/tech.png"),252,151);
			 ctx.textAlign = "center";
			ctx.font = "Bold 16px continuummedium";
			ctx.fillStyle = "rgba(255,255,255,0.8)";
			ctx.fillText( intersects[ 0 ].object.name, 336, 168);
			ctx.fillText( T["ID"], 379, 192);
			ctx.fillText( T["Vic."], 417, 194);
			ctx.fillText( T["Pts."], 417, 218);
			ctx.fillStyle = "rgba(0,255,255,0.8)";
			ctx.fillRect(0,0,512,512);

			ctx.fillText( 			 intersects[ 0 ].object.tid , 379, 218);
			ctx.fillText( GetNodeVic(intersects[ 0 ].object.tid), 454, 194);
			ctx.fillText( GetNodePts(intersects[ 0 ].object.tid), 454, 218);
			overtext.needsUpdate = true;

			//GUI.menu.Focus(intersects[ 0 ].object.tid);
			
			if ( intersects[ 0 ].object != INTERSECTED ) {
				INTERSECTED = intersects[ 0 ].object;
				console.log(intersects[ 0 ].object.name);
				//GUI.menu.Focus(INTERSECTED.tid);
				//if (INTERSECTED.tid>0) INTERSECTED.showlink(true);
			}
		} 
		else
		{
			if ( INTERSECTED ) {
				//if (INTERSECTED.tid>0) INTERSECTED.showlink(false);
				INTERSECTED = null;
			}
			NewScene.focusSprite.visible = false;
			//GUI.menu.Focus(-1);
			ctx.clearRect(0,0,512,512);
			overtext.needsUpdate = true;
		}
	}

	//over systeme example for particules
	if (system.visible) { 
		ray.params.Points.threshold = controls.radius/16;
		var intersects = ray.intersectObject( icons );
		if (intersects.length > 0) {
			var bid = system.geometry.getAttribute('galaxyid').array[intersects[0].index];
			var pos = new THREE.Vector3(icons.geometry.getAttribute('position').array[intersects[0].index*3+0],
										icons.geometry.getAttribute('position').array[intersects[0].index*3+1],
										icons.geometry.getAttribute('position').array[intersects[0].index*3+2]);
			system.cursor.position.copy(pos);
			//galaxy.cursor.position.setX(12);
			var scale = (3-icons.geometry.getAttribute('texture').array[intersects[0].index])/12;
				scale *= pos.clone().distanceTo ( camera.position.clone() );
			system.cursor.scale.set(scale, scale, 1.0);
			
			if (controls.istraveling) 	system.cursor.visible = false;
			else 						system.cursor.visible = true;

			if (mouse.c) {
				if (systemtracking == bid)
					controls.traveling(pos.clone(),0.01*systemscale);
				else
					controls.traveling(pos.clone(),0.1*systemscale);
				systemtracking = bid;
				system.cursor.visible = false;
				mouse.c = false;
			}
		} else {
			if (mouse.c) {
				systemtracking = -1;
				mouse.c = false;
			}
			system.cursor.visible = false;
		}
	}

}