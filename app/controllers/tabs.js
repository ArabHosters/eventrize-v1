var names = ['home', 'schedule', 'speakers', 'exhibitors', 'sponsors'] ; 
for (var i =0 ; i<names.length;i++){
	//names[i] =  Alloy.Globals.Tabs[i].controller;
	$[names[i]].name = Alloy.Globals.Tabs[i].controller;
	$[names[i]+'Label'].text = Alloy.Globals.Tabs[i].title;
	if (i==0){
		$[names[i]+'Icon'].image = '/img/icons/'+Alloy.Globals.Tabs[i].controller+'-pressed.png';	
	}else{
		$[names[i]+'Icon'].image = '/img/icons/'+Alloy.Globals.Tabs[i].controller+'.png';
	}
	
	
}

var df = Alloy.Globals.dataFormat;

var tabWidth = Ti.Platform.displayCaps.platformWidth/5;

var tabPositions = {
	home:0,
	schedule:"20%",
	speakers:"40%",
	exhibitors:"60%",
	sponsors:"80%"
};

if(Alloy.Globals.currentLang == 'ar')
{
	$.home.right = tabPositions.home;
	$.schedule.right = tabPositions.schedule;
	$.speakers.right = tabPositions.speakers;
	$.exhibitors.right = tabPositions.exhibitors;
	$.sponsors.right = tabPositions.sponsors;
	
}
else
{
	$.home.left = tabPositions.home;
	$.schedule.left = tabPositions.schedule;
	$.speakers.left = tabPositions.speakers;
	$.exhibitors.left = tabPositions.exhibitors;
	$.sponsors.left = tabPositions.sponsors;

}


function doTab(name,offset,noEvent) {
	 
	
	
		
		if(Alloy.Globals.isOpen)
			Alloy.Globals.toggleMenu();
			
		_.each(names, function(item) { 
				if (name === $[item].name) 
				{
					
					$[item+'Icon'].image = '/img/icons/'+$[item].name+'-pressed.png';
					$[item+'Label'].color = '#e87731';
				}
				else 
				{
					$[item+'Icon'].image = '/img/icons/'+$[item].name+'.png';
					$[item+'Label'].color = '#000';
				}
				
		});
		
		
	if(!noEvent){
		Ti.App.fireEvent("app:tabs_item",{item:name});
		
		if(df[name])
		{
			var data = {
				name:df[item].controller,
				type:item,
				
			};
			
		}
		else
		{			
			var data = {
				name:name,
				type:"nodetails"
			};
		}
		
		
		
			$.trigger('change',data);	
			
			Alloy.Globals.setABTitle({text:L(name),color:"#611F53"});
		}	
}

$.home.on('click', function() {
	
	doTab($.home.name, tabPositions.home);	
});

$.schedule.on('click', function() {
	doTab($.schedule.name, tabPositions.schedule);
});

$.speakers.on('click', function() {
	Alloy.Globals.ref = null ;
	Alloy.Globals.Log('name '+$.speakers.name) ;
	doTab($.speakers.name, tabPositions.speakers);
});

$.exhibitors.on('click', function() {
	doTab($.exhibitors.name, tabPositions.exhibitors);
});

$.sponsors.on('click', function() {
	doTab($.sponsors.name, tabPositions.sponsors);
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};

Ti.App.addEventListener("app:menu_click",function(e){
	$.setTab(e.item); 
});