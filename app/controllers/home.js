if (Alloy.Globals.currentLang == 'en') 
{
	$.headertitle.textAlign = 'left';
	$.para.textAlign = 'left'; 
} 
else 
{
	//they are initially right aligned  
}

var data = Alloy.Globals.jsonData;
$.headertitle.text = data.title;
$.para.html = data.content;
//
$.BG.backgroundColor=Alloy.Globals.Home.backgroundColor; 
$.headertitle.color = Alloy.Globals.Home.headerTitleColor;
$.headertitle.font = {
	fontSize:Alloy.Globals.Home.headerTitleSize+"dp"
};
$.para.color = Alloy.Globals.Home.paraColor;
$.para.font = {
	fontSize:Alloy.Globals.Home.paraSize+"dp"
};
//

$.swfacebook.addEventListener("click", function(e) {
	Ti.Platform.openURL("https://www.facebook.com/");
});

$.swtwitter.addEventListener("click", function(e) {
	Ti.Platform.openURL("https://twitter.com/");
});

