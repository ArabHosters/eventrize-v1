$.loader.images = [
		'/img/loading/0.png',
		'/img/loading/1.png',
		'/img/loading/2.png',
		'/img/loading/3.png',
		'/img/loading/4.png',
		'/img/loading/5.png'			
	];

$.start = function() {
	
	$.loader.start();
};

$.stop = function() {
	
	$.loader.stop();
	$.message.text = L('msg_load');
};

$.setMessage = function(key) {
	
	$.message.text = L('load')+key+L('wait');
};

$.setAnyMessage = function(key){
	$.message.text = key;
};
