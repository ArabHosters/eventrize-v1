if (Alloy.Globals.currentLang == 'en') {
	$.para.textAlign = 'left';
	$.copyrights.textAlign = 'left';
} else {
	
}
$.para.html = Alloy.Globals.jsonData.CTF;

Ti.API.info('CTF: '+Alloy.Globals.jsonData.CTF);
$.eventrize.addEventListener("click",function(e){
	Ti.Platform.openURL("http://eventrize.com");
});


$.swwebsite.addEventListener("click",function(e){
	Ti.Platform.openURL("http://eventrize.com");
});


$.swfacebook.addEventListener("click",function(e){
	Ti.Platform.openURL("https://www.facebook.com/eventrize");
});	

$.swtwitter.addEventListener("click",function(e){
	Ti.Platform.openURL("https://twitter.com/Eventrize");
});

$.copyrights.addEventListener("click",function(e){
	Ti.Platform.openURL("http://www.apache.org/licenses/LICENSE-2.0.html");
});
