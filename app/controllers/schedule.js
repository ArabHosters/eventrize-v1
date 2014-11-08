var schedule = Alloy.Globals.jsonData.sessions;
var dnames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var filled=0, dayindex=0, days = [], days_titles = [], days_views = []; 

var todayD = new Date();
var today = todayD.getDate()+"-"+(parseInt(todayD.getMonth())+1);
var exTabs = [];

var currentTab = 0 ; 

Alloy.Globals.ref ="";



// setting up days data
_.each(schedule,function(item,day){
	var day_sessions=[];
	
	var d = new Date(parseInt(item[0].session_startdate)*1000);
	days.push(d);
	days_titles.push(dnames[d.getDay()]+" "+d.getDate());
	var table = Ti.UI.createTableView({separatorColor:"transparent"});

	_.each(item,function(session,sid){
		
		session_type = session.session_type == "other_session"?session.session_type_other:session.session_type;
	
		connected = typeof connected !== 'undefined' ? connected : 1;
		
		
		var srow = Ti.UI.createTableViewRow({
			className:"session",
			layout:"vertical",
			rightImage:"/img/schedule/"+session_type+".png",			
			color:"black",
			ssid:sid,
			key:day,
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
			width:"73%",
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
		Ti.API.info(sid +"   "+item.length -1);
		if(sid < item.length -1){
		
			srow.add(sbar);		}
		
		day_sessions.push(srow);
	});
	
	table.setData(day_sessions);
	
	days_views.push(table);	
	if(today == day)
		filled=dayindex;
	
	
	dayindex++;
	
	
table.addEventListener("click",function(e){
	
	
	var data = {
		name:"scheduleDetails",
		type:'',
		index:e.row.ssid,
		day:e.row.key
	};
	Alloy.Globals.currentrow = e.row.ssid ; 
	Alloy.Globals.currentday = e.row.key ; 
	
	Alloy.Globals.currentSection.trigger("nav",data);
	});
	
});

$.contentView.add(days_views[filled]);


$.headerView = Alloy.Globals.HeaderView({
	title:L('schedule_days'),
	optionWidth:25,
	options:days_titles,
	defcolors:[Alloy.Globals.schedule.headerViewColor]
});
	
$.tabbar.add($.headerView);
if(filled != 0 )
	$.headerView.goTo(filled);
$.headerView.on('change', function(e) {
	$.contentView.removeAllChildren();
	currentTab = e.selection ;
	currentDayView = days_views[days_titles.indexOf(e.selection)];
	$.contentView.add(currentDayView);
	
});
	
	
	

