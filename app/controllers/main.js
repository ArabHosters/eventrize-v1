//controller instance variables
var sections = {
		home: Alloy.createController(Alloy.Globals.current,Alloy.Globals.currentContData) //will dynamically populate with others as requested
	},
	currentSection,
	isOpen = false;
	
//Initialize to home section
currentSection = sections.home;
Alloy.Globals.currentSection = sections.home;
$.content.add(currentSection.getView());
currentSection.trigger('focus');				
currentSection.on('nav', sectionNav);			







function sectionNav(e) {
	Ti.API.info('sectionNav');
	
		
		//sections[e.name] = Alloy.createController(e.name,e); -new
		var oldSection = currentSection;
		//currentSection = sections[e.name]; -new
		currentSection = Alloy.createController(e.name,e); 
		
		Alloy.Globals.old = Alloy.Globals.current;
		Alloy.Globals.oldSection = Alloy.Globals.currentSection;
		Alloy.Globals.oldType = Alloy.Globals.currentType;
		 
		Alloy.Globals.current = e.name;
		Alloy.Globals.currentSection = currentSection;
		Alloy.Globals.currentType  = e.type;
		
		currentSection.on('nav', sectionNav);  //#podo
		
		$.content.remove(oldSection.getView());
		
		$.content.add(currentSection.getView());
		
	//}
}
$.tabs && ($.tabs.on('change', sectionNav));



