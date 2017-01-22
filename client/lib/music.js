var master_volume = 100;
soundManager.setup({
  url: '/none/',
  onready: function() {
	soundManager.createSound({
	  id: 'AN9',
	  url: 'http://89.234.182.150/H-LAM.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN5')}
	});
	soundManager.createSound({
	  id: 'AN5',
	  url: 'http://89.234.182.150/H-LI.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN6')}
	});
  },
  ontimeout: function() {
	// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
  }
});

var musics = [
	{ id: 'AN9', isPlaying: false, next: 'AN5' },
	{ id: 'AN5', isPlaying: false, next: 'AN9' }
];

function Mute() {
	if (soundManager.muted)
		soundManager.unmute();
	else
		soundManager.mute();
}

function Play(id) {
	Stop();
	if (id == undefined)
        soundManager.play(musics[0].id);
	else
		musics.forEach(function (e) {
			if (e.id == id && !e.isPlaying) {
				soundManager.play(id);
				e.isPlaying = true;
			}
		});
}

function Stop(id) {
    musics.forEach(function (e) {
    	if (id === undefined || e.id == id) {
            e.isPlaying = false;
            soundManager.stop(e.id);
        }
    });
}