var master_volume = 2;
soundManager.setup({
  url: '/none/',
  onready: function() {
	soundManager.createSound({
	  id: 'AN9',
	  url: 'music/AN_Reboot_09_Stars.80k.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN5')}
	});
	soundManager.createSound({
	  id: 'AN5',
	  url: 'music/AN_Reboot_05_Stop.80k.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN6')}
	});
	soundManager.createSound({
	  id: 'AN6',
	  url: 'music/AN_Reboot_06_Search.80k.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN2')}
	});
	soundManager.createSound({
	  id: 'AN2',
	  url: 'music/AN_Reboot_02_Reboot.80k.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN8')}
	});
	soundManager.createSound({
	  id: 'AN8',
	  url: 'music/AN_Reboot_08_AscendingDreams.80k.mp3',
	  volume: master_volume,
	  onfinish : function(){soundManager.play('AN9')}
	});
  },
  ontimeout: function() {
	// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
  }
});

function Mute() {
	if (soundManager.muted)
		soundManager.unmute();
	else
		soundManager.mute();
}

function Play() {
	soundManager.play('AN9');
}