$.loading = Alloy.createController('loading');
$.loading.getView("backdrop").visible=false;
var loading = false;
var current_tab = "Timeline";

var Codebird = require("codebird");
var cb = new Codebird();
cb.setConsumerKey('S4JMPxJwo8dus30SX09w', 'ZzHqiUZj3MAHpa3HfLLChjQEcDPCfVo4HACFZwpqvQ');
var news_titles = ["@Bluekaizen Timeline","#CSCamp2014 Tweets"];
var news_views = [];
var Tabs = []; 
var table,tweets_rows,bearerToken;
	
function loadView(){
	$.loading.setAnyMessage(L('Twitter_load')) ;	
	table = Ti.UI.createTableView({separatorColor:"transparent"});
	tweets_rows = [];
	bearerToken = Ti.App.Properties.getString('TwitterBearerToken', null);	
	doLoad();
	
	//////// 

	if(bearerToken == null)
	{
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
	} 
	else 
	{
		
		cb.setBearerToken(bearerToken);
		fetchTwitter();
	}
}


loadView();

function generateRows(tweets){
		tweets_rows = []; 
		
		
		_.each(tweets,function(tweet,sid){
				
				
				var srow = Ti.UI.createTableViewRow({
					className:"status",
					layout:"vertical",
					color:"black",
					tid :tweet.id_str,
					tscreen:tweet.user.screen_name,		
					height:Ti.UI.SIZE,			
				});
						
				var scontent = Ti.UI.createView({
					layout:"horizontal",
					width:"100%",
					height:Ti.UI.SIZE
				});
				
				var timage = Ti.UI.createImageView({
					image : tweet.user.profile_image_url,
					height:"48dip",
					width:"48dip",
					left:"10dp",
					top:"4dp",
					
				});
				
				var titleNContent = Ti.UI.createView({
					height:Ti.UI.SIZE,
					width:Ti.UI.FILL,
					left:"10dp",
					top:"4dip",
					layout:"vertical"
				});
				
				var sname = Ti.UI.createLabel({
					text:tweet.user.name,
					color:Alloy.Globals.twitter.snameColor,
					font:{
						fontSize:Alloy.Globals.twitter.snameSize+'dp',
						fontWeight:'bold'
					},			
					height:Ti.UI.SIZE,
					width:Ti.UI.FILL,
					top:0,
					verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
				});
				var stext = Ti.UI.createLabel({
					text:tweet.text,
					color:Alloy.Globals.twitter.stextColor,
					font:{
						fontSize:Alloy.Globals.twitter.stextSize+'dp'
					},			
					height:Ti.UI.SIZE,
					width:Ti.UI.FILL,
				});
				
				titleNContent.add(sname); 
				titleNContent.add(stext);
				
				
				scontent.add(timage);
				scontent.add(titleNContent);
				
				srow.add(scontent);
				
				
				var sbar = Ti.UI.createView({
					width:"80%",
					left:"10%",
					backgroundColor:Alloy.Globals.twitter.sbarBG,
					height:Alloy.Globals.twitter.sbarHeight+"dp"
				});
				
				
				if(sid < tweets.length-1)
					srow.add(sbar);		
				
				
				
				
				tweets_rows.push(srow);
				
			});
			
			return tweets_rows;
			
}

function fetchTwitter(){
	Alloy.Globals.Log('inside fetch twitter') ;
	if(current_tab == "Timeline"){
		cb.__call(
			
		    //'search_tweets',
		    'statuses/user_timeline',
		    {screen_name:"Bluekaizen"},
		    //"q="+Ti.Network.encodeURIComponent("@dsoftz")+"&result_type=recent&count=30",
		    function (reply) {
		    	//Alloy.Globals.Log(reply);
		       	//var tweets = reply.statuses;
		       	var tweets = reply; 
				//configFile.write(JSON.stringify(tweets));
				table.setData([]);
				table.setData(generateRows(tweets));
				table.addEventListener("click",function(e){
						screen_name = e.row.tscreen;
						tid = e.row.tid;
						url = "https://twitter.com/"+screen_name+"/status/"+tid;
						Ti.Platform.openURL(url);
				});
				doLoad(true);
				
				$.contentView.add(table);
		        Alloy.Globals.Log("success");
		       
		    },
		    true // this parameter required
		);
	}else{
		cb.__call(
			
		    'search_tweets',
		    "q="+Ti.Network.encodeURIComponent("#CSCAMP2014"),//+"&result_type=recent&count=30",
		    function (reply) {
		    	Alloy.Globals.Log(JSON.stringify(reply));
		       	var tweets = reply.statuses;
		       	//var tweets = reply; 
				//configFile.write(JSON.stringify(tweets));
				table.setData([]);
				table.setData(generateRows(tweets));
				table.addEventListener("click",function(e){
						screen_name = e.row.tscreen;
						tid = e.row.tid;
						url = "https://twitter.com/"+screen_name+"/status/"+tid;
						Ti.Platform.openURL(url);
						
				});
				doLoad(true);
				
				$.contentView.add(table);
		        Alloy.Globals.Log("success");
		       
		    },
		    true // this parameter required
		);
	}
	
}


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

$.headerView = Alloy.Globals.HeaderView({
	title:L('Twitter_header'),
	optionWidth:37,
	options: news_titles,
	defcolors:[Alloy.Globals.ThemeColor]
});

$.tabbar.add($.headerView);



$.headerView.on('change', function(e) {
	
	if(e.selection.indexOf("Timeline") != -1)
		current_tab="Timeline";
	else
		current_tab="Mentions";	
		
	$.contentView.removeAllChildren();
	loadView();
});
	