// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/

THREEx.WindowResize	= function(renderer, camera, ortho){
	var callback	= function(){
		var screenw = document.documentElement.clientWidth;
		var screenh = document.documentElement.clientHeight;
		// update the camera
		camera.aspect	= screenw / screenh;
		// notify the renderer of the size change
		renderer.setSize( screenw, screenh );
		camera.updateProjectionMatrix();
		if (ortho) {
			//console.log(screenw,screenh);
			camera.left   = -screenw / 2;
	        camera.right  =  screenw / 2;
	        camera.top    =  screenh / 2;
	        camera.bottom = -screenh / 2;
			GUI.Resize();
			GUI.Draw();
		}
		
		/*//if (THREEx.FullScreen.activated()) {
			// update the camera
			camera.aspect	= window.innerWidth / window.innerHeight;
			// notify the renderer of the size change
			renderer.setSize( window.innerWidth, window.innerHeight );
			camera.updateProjectionMatrix();
			if (ortho) {
				camera.left = -window.innerWidth / 2;
	            camera.right = window.innerWidth / 2;
	            camera.top = window.innerHeight / 2;
	            camera.bottom = -window.innerHeight / 2;
				GUI.Resize();
				GUI.Draw();
			}
		}*/
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}