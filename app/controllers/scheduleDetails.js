var args = arguments[0];
var df = Alloy.Globals.dataFormat;
var selectedTab =0;
var schedule = Alloy.Globals.jsonData.sessions;
var aday = args.day ; 
var sindex = args.index;
Alloy.Globals.ref ="sdetails";





	var session = schedule[aday][sindex];

	
	var dnames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	Alloy.Globals.currentSessionId = session.session_id;
	var d = new Date(parseInt(session.session_startdate)*1000);	
	day_title = dnames[d.getDay()]+" "+d.getDate();
	
	$.heading.text = session.session_title;
	$.subheading.text = day_title+", "+session.session_starttime+" - "+session.session_endtime;
		

	
	var scheduleTabsTitles = ['Info', 'Speakers'];// , 'Feedback'];//,'Ask']; 
	

	
	
	
tabView =	Alloy.Globals.HeaderView({
			title:L('scheduleDetails'),
			optionWidth:25,
			options:scheduleTabsTitles,
			defcolors:[Alloy.Globals.scheduleDetails.headerViewColor]
	});
	
	
	scheduleViews = [];
	
	// ----------------- Info View ------------------
	var info = Alloy.createController('schedule/sessionInfo').getView();
	info.html = session.session_content;
	scheduleViews.push(info);

	// ----------------- Speakers View ------------------
	var speakers = Alloy.createController('schedule/sessionSpeakers').getView();
	speakersData = session.session_speakers;
	data_type = "speakers";
	
	var speakers_by_id = {};
	// temporary workaround to get speaker image by speaker_id from main speakers 
	_.each(Alloy.Globals.jsonData.speakers,function(speaker,index) {
		speakers_by_id[speaker.speaker_id]=speaker;
	});
	
	var persons_rows = [];
	_.each(speakersData,function(person,index) {
		person.image = speakers_by_id[person.speaker_id].image;
		
		person_row = new Alloy.Globals.PersonRow(person,speakers_by_id[person.speaker_id].speaker_id,df,data_type,speakersData.length);
		person_row.on("click",function(e){
			var data = {
				name:df[data_type].contDetails,
				type:df[data_type].jsonindex,
				index:e.row.pid
			};
			Alloy.Globals.ref = "sdetails";
			Alloy.Globals.currentSection.trigger("nav",data);
		});
	  	persons_rows.push(person_row);
	});

	speakers.setData(persons_rows);
	scheduleViews.push(speakers);

	// ----------------- Feedback View ------------------	
	
	//var feedback = Alloy.createController('schedule/sessionFeedback');
	//scheduleViews.push(feedback.getView());
	/*
	Ti.App.addEventListener("app:reviewed",function(e){
		var feedback = Alloy.createController('schedule/sessionFeedback');
		scheduleViews[2] = feedback.getView();
		tabView.fireEvent("change",{selection:"Feedback"});
		Alloy.Globals.Toast("Thanks for your feedback",0);
	});
	*/
	$.tabbar.add(tabView);
	
	tabView.on('change', function(e) {
		$.contentView.removeAllChildren();
		selectedTab = scheduleTabsTitles.indexOf(e.selection);		
		
		
		//if(selectedTab == 2)
			//feedback.popup();
		
		currentView = scheduleViews[selectedTab];
		currentView && $.contentView.add(currentView);
		
		//currentDayView.scrollToTop();
	});
	
	
	//if coming from back button from speaker profile
	if(Alloy.Globals.wasperson == true){
		selectedTab = 1;
		tabView.goTo(1);
				
	} 

	
	$.contentView.add(scheduleViews[selectedTab]);

//});

if (Alloy.Globals.currentLang == 'ar') 
{
	$.heading.textAlign = 'right';
	$.subheading.textAlign = 'right'; 
	info.textAlign = 'right';
} 
else 
{
	//they are initially left aligned  
}
