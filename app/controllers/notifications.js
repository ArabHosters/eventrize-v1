$.loading = Alloy.createController('loading');
$.loading.getView("backdrop").visible=false;
var loading = false;

var Mfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"messages.json");
$.loading.setAnyMessage(L('notf_load')) ; 
doLoad();
/*
var Codebird = require("codebird");
var cb = new Codebird();
cb.setConsumerKey('S4JMPxJwo8dus30SX09w', 'ZzHqiUZj3MAHpa3HfLLChjQEcDPCfVo4HACFZwpqvQ');

var news_titles = ["Twitter #SWDXB","Messages"];
var news_views = [];
var Tabs = []; 
*/

function doLoad(loadstatus){
	loadstatus = typeof loadstatus !== 'undefined' ? loadstatus : loading;
	//Alloy.Globals.Log(loadstatus);
	
	if(loadstatus){
		loading=false;
		$.loading.stop();
		$.pagecontainer.remove($.loading.getView());				
	}else{
		loading = true;
		$.pagecontainer.add($.loading.getView());
		$.loading.start();
	}	
}


		
		var url = Alloy.Globals.NotificationsURL;
		var xhr = Ti.Network.createHTTPClient({
		    onload: loadNoti,
		    onerror: Notierror,
		    timeout:9000  
		});
		xhr.open("GET", url);
		xhr.send();
	
	
	
	/*
	
var content = Mfile.read();
var Messages = Alloy.Globals.Messages = JSON.parse(content.text);

content = null;
*/

function parseNoti(Messages){
	var table = Ti.UI.createTableView({separatorColor:"transparent"});
    var mrows = [];
    var view;
    if(Messages.length > 0){
    	$.contentView.removeAllChildren();
		_.each(Messages,function(message,sid){
			
			var srow = Ti.UI.createTableViewRow({
				className:"status",
				layout:"vertical",
				color:"black",
			});
					
			var scontainer = Ti.UI.createView({
				layout:"horizontal",
				width:"100%",
				//height:"60dp"
				height:Ti.UI.SIZE,
				top:"5dp",
				//borderColor:"red",borderWidth:1,
			});
			
			
			var stime = Ti.UI.createLabel({
				text:String.formatTime(new Date(parseInt(message.date)*1000)),
				//text:"9:00 AM",
				color:"#611F53",
				height:Ti.UI.FILL,
				//borderColor:"blue",borderWidth:1,
				//width:"10%",
				width:Ti.UI.SIZE,
				left:"10dp",
				top:"10dp",
				font:{
					fontWeight:"bold",
					fontSize:'16dp'
				},
				verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
			});
			
			var stitle = Ti.UI.createLabel({
				html:"<b>"+message.title+"</b><br />"+message.noti_content,
				//html:"test",
				color:"black",
				//borderColor:"green",borderWidth:1,
				font:{
					//fontWeight:"bold",
					//fontSize:'14dp'
				},			
				height:Ti.UI.SIZE,
				width:"75%",
				//left:"10dp",
				verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
				
			});
			
			var sbar = Ti.UI.createView({
				width:"80%",
				left:"10%",
				backgroundColor:"black",
				top:"5dp",
				height:"1dp"
			});
			
			scontainer.add(stitle);
			scontainer.add(stime);
			
			
			srow.add(scontainer);
			if(sid < Messages.length-1)
				srow.add(sbar);
				
			srow.addEventListener("click",function(e){
				if(message.noti_update == "on")
						Ti.App.fireEvent("app:reload");
				else if(message.noti_url)
						Ti.Platform.openURL(message.noti_url);	
			
					
			});			
			
			mrows.push(srow);
			
		});
			
		table.setData(mrows);
		view = table;
	    
	}else{
		var no_noti = Ti.UI.createLabel({
			text:L('notf_empty'),
			color:"#611F53",
			font:{
				fontSize:'18dp'
			}
			});
		view = no_noti;
	}
	doLoad();
	$.contentView.add(view);
	
}

function loadNoti(e){
	
	var MessagesObj = JSON.parse(this.responseText);
	var Messages = MessagesObj.notifications;
	var MessagesText =  JSON.stringify(Messages);
	
	Mfile.write(MessagesText);	
	parseNoti(Messages);	
		
}

function Notierror(e){
	var toast = Ti.UI.createNotification({
	    message:L('notf_toast'),
	    duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	toast.show();
	
	var content = Mfile.read();	
	var Messages = (content.text =="")?{}:JSON.parse(content.text);
	content = null;
	parseNoti(Messages);
}

/*
var bearerToken = Ti.App.Properties.getString('TwitterBearerToken', null);
if(bearerToken == null){
	cb.__call(
	    'oauth2_token',
	    {},
	    function (reply) {
	        var bearer_token = reply.access_token;
	        cb.setBearerToken(bearer_token);
	        Ti.App.Properties.setString('TwitterBearerToken', bearer_token);
	        fetchTwitter();
	    }
	);
} else {
	Alloy.Globals.Log("We do have a bearer token...");
	cb.setBearerToken(bearerToken);
	fetchTwitter();
}


function fetchTwitter(){
	cb.__call(
	    'search_tweets',
	    "q="+Ti.Network.encodeURIComponent("#SWDXB")+"&result_type=recent",
	    function (reply) {
	        // ...
	        
	        
	        //Alloy.Globals.Log(reply.statuses);
	        var table = Ti.UI.createTableView({separatorColor:"transparent"});
	        var tweets_rows = [];
			var tweets = reply.statuses; 
			_.each(tweets,function(tweet,sid){
				//Alloy.Globals.Log(status);
				
				var srow = Ti.UI.createTableViewRow({
					className:"status",
					layout:"vertical",
					//leftImage:"/img/schedule/"+session_type+".png",
					//leftImage:status.user.profile_image_url,
					//title:tweet.text,		
					color:"black",
				});
						
				var scontent = Ti.UI.createView({
					layout:"horizontal",
					width:"100%",
					height:"60dp"
				});
				var stime = Ti.UI.createLabel({
					text:"09:30 AM",
					color:"#611F53",
					height:Ti.UI.FILL,
					//borderColor:"blue",borderWidth:1,
					//width:"25%",
					width:Ti.UI.SIZE,
					left:"10dp",
					//top:"10dp",
					font:{
						fontWeight:"bold",
						fontSize:'16dp'
					},
					verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
				});
				
				var stitle = Ti.UI.createLabel({
					text:tweet.text,
					color:"black",
					//borderColor:"green",borderWidth:1,
					font:{
						fontWeight:"bold",
						fontSize:'14dp'
					},			
					height:Ti.UI.FILL,
					width:Ti.UI.FILL,
					left:"10dp",
					verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
					
				});
				
				var sbar = Ti.UI.createView({
					width:"80%",
					left:"10%",
					backgroundColor:"black",
					height:"1dp"
				});
				
				
				scontent.add(stime);
				scontent.add(stitle);
				
				srow.add(scontent);
				if(sid < item.length-1)
					srow.add(sbar);		
				
				tweets_rows.push(srow);
				
			});
			
			table.setData(tweets_rows);
			news_views.push(table);
			doLoad();
	        $.contentView.add(news_views[0]);
	        //Alloy.Globals.Log(reply.statuses[0]);
	        Alloy.Globals.Log("success");
	    },
	    true // this parameter required
	);
}





HeaderView = function(options) {
	var self = Ti.UI.createView(_.extend({
		height:'35dp',
		top:'5dp',
	}, options.viewArgs || {}));
	
	var indicator = Ti.UI.createView({
		top:0,
		right:(options.optionWidth*(options.options.length-1))+'%',
		bottom:'1dp',
		width:options.optionWidth+'%',
		backgroundColor:'white',
		opacity:"0.6"
	});
	self.add(indicator);
	
	var title = Ti.UI.createLabel({
		text:options.title,
		color:'#611F53',
		left:'10dp',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		font: {
			fontSize:'14dp',
			fontWeight:"bold"
		}
	});
	self.add(title);
	
	//Create a styled menu option
	function option(t,idx,lcolor) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'%';
		
		var v = Ti.UI.createView({
			width:"37%",
			right:rightOffset,
			id:t
		});
		
		var l = Ti.UI.createLabel({
			id:"tab-"+idx,
			text:t,
			color:lcolor,
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			font: {
				fontSize:'12dp'
			},
			textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		
		v.add(l);
		
		//option selection
		v.addEventListener('click', function() {
			
			indicator.animate({
				right:rightOffset,
				duration:250
			}, function() {
				self.fireEvent('change',{
					selection:t
				});
				l.color="#E56227";
			});
		});
		
		
		return v;
	}
	
	
	//Create menu options for each option requested
	for (var i=0, l=options.options.length; i<l; i++) {
		Tabs[i]=option(options.options[i], i,options.defcolors[i]);
		self.add(Tabs[i]);
	}
	
	//Add common shortcut to addEventListener
	self.on = function(ev,cb) {
		self.addEventListener(ev,cb);
	};
	
	//Shift indicator to desired index
	self.goTo = function(idx) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'%';
		indicator.right = rightOffset;
		Tabs[idx].fireEvent("click");
		
	};
	
	return self;
};

	$.headerView = HeaderView({
		title:'Channels :',
		//optionWidth:25,
		optionWidth:37,
		options: news_titles,
		defcolors:['#E56227','#E56227','#E56227']
	});

	$.tabbar.add($.headerView);
	//$.headerView.goTo(filled);

	$.headerView.on('change', function(e) {
		$.contentView.removeAllChildren();
		currentView = news_views[e.selection];
		$.contentView.add(currentView);
	});
	
	*/