if (Alloy.Globals.currentLang == 'en') {
	$.logo.right = "2%";
	$.logo.left = null;
	
	$.logo.right = "2%";
	$.logo.left = null;
	
	$.heading.left = "2%";
	$.heading.right = null;
	
	$.subheading.left = "2%";
	$.subheading.right = null;
	
	$.socialbar.left = "2%";
	$.socialbar.right = null;
	
	//$.bio.textAlign = 'left';
}

var df = Alloy.Globals.dataFormat;
var args = arguments[0];
var data_type = args.type;
var id = args.index;
var index ;



var selectedTab =0; // for tabs 



	
for (var i=0;i<Alloy.Globals.jsonData[df[data_type].jsonindex].length;i++){
	if (Alloy.Globals.jsonData[df[data_type].jsonindex][i].speaker_id == id)
		{
			index  = i ;
			break ;
		}
	
}




var data = Alloy.Globals.jsonData[df[data_type].jsonindex][index];
Alloy.Globals.person = true; 
Alloy.Globals.wasperson = true; 




var social_list = data[df[data_type].social];
$.heading.text = data[df[data_type].heading];

if(data[df[data_type].subheading] != undefined)
	$.subheading.html = "<i>"+data[df[data_type].subheading];+"</i>";
	
//$.bio.text = data[df[data_type].bio];
$.logo.image = data.image;

$.logo.on("click",function(){
	
	if(data_type == "exhibitors" &&  data[df[data_type].website] != undefined ){
		Ti.Platform.openURL(data[df[data_type].website]);	
	}else{
	
		var win=Ti.UI.createWindow({modal:true,navBarHidden:true});
		var img = Ti.UI.createImageView({
			image:data.image
		});
		win.add(img);
		win.open();
	}
	
		
});

// Social Links
if(social_list){
	
	
	var iconsNo = social_list.length;
	var barWidth = (iconsNo*24)+((iconsNo-1)*12); 
	
	$.socialbar.width=barWidth+"dp";
	//$.socialbar.width=Ti.UI.SIZE;
	var social_left =0;
	
	
	//Alloy.Globals.Log(social_list);
	_.each(social_list, function(item) {
		var social_img = Ti.UI.createImageView({
			image:"/img/social/"+item.stack_title+".png",
			id:item.stack_title
		});
		
		$.addClass(social_img,'social');
		
		social_img.applyProperties({
			left:social_left+"dp"
		});
		
		//social_left+=48;
		social_left=12;
		
		social_img.addEventListener("click",function(e){
			//Alloy.Globals.Log(item.social_url);
			
			if(item.stack_title == "email"){
				var emailDialog = Ti.UI.createEmailDialog();
				emailDialog.subject = "[Contact Form] Via Eventrize App";
				emailDialog.toRecipients = [item.social_url];
				emailDialog.open();	
			}else{
				Ti.Platform.openURL(item.social_url);					
			}
			
		});
		
		$.socialbar.add(social_img);
	
	});
	
}// if social 
social_list=null;

var speakerSessions = []; 
var schedule = Alloy.Globals.jsonData.sessions;


// setting up days data
_.each(schedule,function(item,key){
	_.each(item,function(session,sid){
		
		// My code gose here.
		
		
		if(data.speaker_id==session.session_speakers[0].speaker_id){
			session.key = key;
			session.sid = sid;
			speakerSessions.push(session); 
		}
	});
	
});


// the header 
var speakerTabsTitles = ['Bio', 'Sessions'];

tabView =	Alloy.Globals.HeaderView({
			title:"Speaker:",
			optionWidth:25,
			options:speakerTabsTitles,
			defcolors:[Alloy.Globals.scheduleDetails.headerViewColor]
});

speakerViews = [];

// ----------------- Bio View ------------------
	var bioView= Alloy.createController('schedule/sessionInfo').getView();
	bioView.html= data[df[data_type].bio];
	speakerViews.push(bioView);
// ----------------- Sessions View ------------------
	var sessionsView = Alloy.createController('schedule/sessionSpeakers').getView();

	var session_rows = []; 
	
	
	for(var i=0;i<speakerSessions.length;i++){
		var session = speakerSessions[i];
		var sid = i;
		session_type = session.session_type == "other_session"?session.session_type_other:session.session_type;
	
		connected = typeof connected !== 'undefined' ? connected : 1;
		
		
		var srow = Ti.UI.createTableViewRow({
			className:"session",
			layout:"vertical",
			rightImage:"/img/schedule/"+session_type+".png",			
			color:"black",
			xid:session.sid,
			key:session.key,
			height:Ti.UI.SIZE
		});
				
		var scontent = Ti.UI.createView({
			//layout:"horizontal",
			width:"100%",
			height:Ti.UI.SIZE,
			top:10
		});
		var stime = Ti.UI.createLabel({
			text:session.session_starttime,
			color:Alloy.Globals.schedule.stimeColor,
			height:Ti.UI.FILL,
			//width:"30%",
			textAlign:"right",
			right:"10dp",
			font:{
				fontWeight:"bold",
				fontSize:Alloy.Globals.schedule.stimeSize+'dp'
			},
			verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
		});
		
		
		
		var stitle = Ti.UI.createLabel({
			html:session.session_title+"<br>By: "+session.session_speakers[0].speaker_name+"<br>At: "+session.session_location,
			textAlign:"left",
			color:Alloy.Globals.schedule.stitleColor,
			font:{
				fontWeight:"bold",
				fontSize:Alloy.Globals.schedule.stitleSize+'dp'
			},			
			height:Ti.UI.FILL,
			width:"70%",
			//right:"33%",
			left:10,
			verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
			
		});
		
		var sbar = Ti.UI.createView({
		width:"80%",
		left:"10%",
		backgroundColor:Alloy.Globals.PersonRowConf.sbarColor,
		height:"1dp",
		top:"10dp"
	});
		
		scontent.add(stitle);
		scontent.add(stime);
		
		
		
		srow.add(scontent);
		
		if(sid < speakerSessions.length -1){
		
			srow.add(sbar);		}
		
		session_rows.push(srow);
	}
	
	

	sessionsView.setData(session_rows); // add rows to the table 
	speakerViews.push(sessionsView);   // add the view to views that will be in the tab

	sessionsView.addEventListener("click",function(e){
	
	
	
	var data = {
		name:"scheduleDetails",
		type:'',
		index:e.row.xid,
		day:e.row.key
	};
	
	Alloy.Globals.aspeakerData = data;
	
	Alloy.Globals.currentrow = e.row.xid ; 
	Alloy.Globals.currentday = e.row.key ; 
	
	Ti.App.fireEvent("aspeaker");
	
	Alloy.Globals.currentSection.trigger("nav",data);
	});

	$.tabbar.add(tabView);
	
	tabView.on('change', function(e) {
		$.contentView.removeAllChildren();
		selectedTab = speakerTabsTitles.indexOf(e.selection);		
		
		
		//if(selectedTab == 2)
			//feedback.popup();
		
		currentView = speakerViews[selectedTab];
		currentView && $.contentView.add(currentView);
		
		//currentDayView.scrollToTop();
	});
	
	
	//if coming from back button from speaker profile
	if(Alloy.Globals.wasperson == true){
		selectedTab = 1;
		tabView.goTo(1);
				
	} 

	
$.contentView.add(speakerViews[selectedTab]);




















