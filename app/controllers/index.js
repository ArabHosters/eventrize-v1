Alloy.Globals.Log("test log ");



Alloy.Globals.AppTitle = L('app');
// Require in the module
var CloudPush = require('ti.cloudpush');
var User = require('User');
var deviceToken = null;
// Enable push notifications for this device
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
	CloudPush.enabled = true;
	deviceToken = e.deviceToken;
	//Alloy.Globals.Log(deviceToken);

	if (!User.confirmLogin()) {
		//Alloy.Globals.Log("not logged");
		User.login('mob@fixedmea.com', '?}^3Fwx82y4Ecg8T{=vU', deviceToken, function(e) {
			//success login
			Alloy.Globals.Log("cloudpush loggedin");
		}, function(e) {
			// error
			Alloy.Globals.Log("cloudpush failed to login");
			Alloy.Globals.Log(e);
		});
	}
}

function deviceTokenError(e) {
	// alert('Failed to register for push notifications, please check your connection and try to restart application !');
}

Alloy.Globals.no_updates = 1;
// Process incoming push notifications


Alloy.Globals.Map = require('ti.map');

// data format

var df = Alloy.Globals.dataFormat = {

	speakers : {
		jsonindex : "speakers",
		controller : "persons",
		contDetails : "personDetails",
		heading : "speaker_name",
		subheading : "speaker_job",
		bio : "speaker_bio",
		social : "speaker_social"
	},
	exhibitors : {
		jsonindex : "exhibitors",
		controller : "persons",
		contDetails : "personDetails",
		url : "exhibitor_website",
		heading : "exhibitor_name",
		category : "exhibitor_category",
		//subheading:"judge_title",
		bio : "exhibitor_info",
		social : "exhibitor_social"
	},
	sponsors : {
		jsonindex : "sponsors",
		controller : "sponsors",
		contDetails : "url",
		url : "sponsor_website",
		heading : "sponsor_name",
		category : "sponsor_category"
		//subheading:"judge_title",
		//bio:"judge_info",
		//social:"judge_social"
	}
};

var mainCont = "home", down_start = "sponsors";
Alloy.Globals.current = mainCont;
Alloy.Globals.currentType = "";
Alloy.Globals.currentContData = {
	type : "nodetails"
};
Alloy.Globals.isOpen = false;



$.loading = Alloy.createController('loading');
var rootDir = Ti.Filesystem.applicationDataDirectory;
var cache = Ti.Filesystem.getFile(rootDir, "cache.json");
var loading = false;
var main_view;

var downloadQueue = {}, xhrRequest = {}, xhrCount = {};
downloadQueue.sponsors = [], xhrRequest.sponsors = [], xhrCount.sponsors = 0;
downloadQueue.speakers = [], xhrRequest.speakers = [], xhrCount.speakers = 0;
downloadQueue.exhibitors = [], xhrRequest.exhibitors = [], xhrCount.exhibitors = 0;
downloadQueue.coaches = [], xhrRequest.coaches = [], xhrCount.coaches = 0;
downloadQueue.organizers = [], xhrRequest.organizers = [], xhrCount.organizers = 0;

function doLoad(loadstatus) {
	loadstatus = typeof loadstatus !== 'undefined' ? loadstatus : loading;

	if (loadstatus) {
		loadstatus = false;
		$.loading.stop();
		$.index.remove($.loading.getView());
	} else {
		loadstatus = true;
		$.index.add($.loading.getView());
		$.loading.start();
	}
}

$.index.backgroundImage = '/img/bg.jpg';

// * ACTION BAR
// Start Configuration
$.headerbar.setParentContainer($.indexcont);
// a reference to the window containing the widget

//$.headerbar.setAppIcon('/appiconcopy.png'); 		// if no icon is provided, the apps default one will be used
$.headerbar.setBlackAngle();
// color of the angle
$.headerbar.setTitle({// the title of the containing window
	text : Alloy.Globals.AppTitle,
	color : Alloy.Globals.HbColor
});
Alloy.Globals.setABTitle = $.headerbar.setTitle;

$.headerbar.setBack(function() {
	toggleMenu();
});
$.headerbar.hideBottomLine();
$.headerbar.showAngle();
// show or hide
$.headerbar.setActionButtons(getExtraButtons());
// action buttons, inflater buttons and menu buttons
// End Configuration

function reload(confirm) {

	confirm = typeof confirm !== 'undefined' ? confirm : 0;
	if (confirm) {
		var od = Ti.UI.createOptionDialog({
			title : L('reload'),
			options : [L('yes'), L('no')],
			cancel : 1
		});

		od.addEventListener('click', function(e) {
			if (e.index === 0) {
				$.headerbar.setTitle({
					text : L('load'),
					color : Alloy.Globals.HbColor
				});
				$.index.remove(main_view);
				start(1);
				//alert("with confirmation");
			}
		});

		od.show();
	} else {
		$.headerbar.setTitle({
			text : L('load'),
			color : Alloy.Globals.HbColor
		});
		$.index.remove(main_view);
		start(1);
		//alert("no confirmation");
	}
}

Ti.App.addEventListener("app:reload", function(e) {
	reload();
});

var locale = require('com.shareourideas.locale');


function getExtraButtons() {
	if (Alloy.Globals.ar === true&&Alloy.Globals.en === true)
	{
		
		return {
		visible : [{
			icon : '/img/abicons/reload.png',
			title : 'Reload',
			action : function() {
				reload(1);
			}
		}, {
			icon : '/ic_menu_share_holo_light.png',
			title : 'Share',
			action : function() {
				var txt = "Get " + Alloy.Globals.AppTitle + " Android App via http://play.google.com ";
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_SEND,
					type : "text/plain"
				});

				intent.putExtra(Ti.Android.EXTRA_TEXT, txt);
				intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
				try {
					Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intent, 'Share'));
				} catch (ex) {
					Ti.UI.createNotification({
						message : 'Complete action using -- Hey, install some sharing apps!'
					}).show();
				}
			}
		},{
			icon : '/img/abicons/earth.png',
			title : 'Reload',
			action : function() {
				var opts = {
				options : ['English','العربية'],
				title : L('lang'),
				selectedIndex:Alloy.Globals.currentLang =='en'?0:1
				};
				var dialog = Ti.UI.createOptionDialog(opts);
				dialog.show();
				dialog.addEventListener("click", function(e) {
				if (e.index == 0) {
					
					if (Alloy.Globals.currentLang == 'en'){
						
					}else{
						Titanium.App.Properties.setString('lang','en');
						locale.setLocale('en');
						Ti.App._restart();
						
						
					}
					
				} else if (e.index == 1) {
					if (Alloy.Globals.currentLang == 'ar'){
						
					}else{
						Titanium.App.Properties.setString('lang','ar');
						locale.setLocale('en');
						Ti.App._restart();
						
					}
				} 
				});
				
				
				}
		}]
	};
		
	}
	else
	{
		return {
		visible : [{
			icon : '/img/abicons/reload.png',
			title : 'Reload',
			action : function() {
				reload(1);
			}
		}, {
			icon : '/ic_menu_share_holo_light.png',
			title : 'Share',
			action : function() {
				var txt = "Get " + Alloy.Globals.AppTitle + " Android App via http://play.google.com ";
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_SEND,
					type : "text/plain"
				});

				intent.putExtra(Ti.Android.EXTRA_TEXT, txt);
				intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
				try {
					Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intent, 'Share'));
				} catch (ex) {
					Ti.UI.createNotification({
						message : 'Complete action using -- Hey, install some sharing apps!'
					}).show();
				}
			}
		
		}]
	};
	}
	
}
start(0);

// menu
$.menu = Alloy.createController('menu');
var menu = $.menu.getView();
var cont = $.indexcont;

$.index.add(menu);

function toggleMenu() {
	animate_duration = 250;
	if (Alloy.Globals.currentLang == 'ar'){  //arabic animate
		if (!Alloy.Globals.isOpen) {
		cont.animate({
			right : "85%",
			left : "-85%",
			duration : animate_duration
		});
		menu.animate({
			right : "0",
			left : "15%",
			duration : animate_duration
		});
		Alloy.Globals.isOpen = true;
	} else {
		cont.animate({
			right : "0",
			left : "0",
			duration : animate_duration
		});
		menu.animate({
			right : "-85%",
			left : "100%",
			duration : animate_duration
		});
		Alloy.Globals.isOpen = false;
	}
	}
	else{//english animate
		
		if(!Alloy.Globals.isOpen){
	 		cont.animate({left:"85%",right:"-85%",duration:animate_duration});
	 		
	 		menu.animate({left:"0",right:"15%",duration:animate_duration});
			Alloy.Globals.isOpen = true;
		}else{
			cont.animate({left:"0",right:"0",duration:animate_duration});
			menu.animate({left:"-85%",right:"0",duration:animate_duration});
			Alloy.Globals.isOpen = false;
		}
		
	}
	
}

Alloy.Globals.toggleMenu = toggleMenu;

Ti.App.addEventListener('app:open.menu', function(e) {
	toggleMenu();
});

$.index.open();
function start(force) {

	doLoad(0);
	//it shows loading

	if (cache.size == 0 || force) {
		Alloy.Globals.Log('cash is empty ');
		Alloy.Globals.Log("need to load data when cash size is 0");
		Alloy.Globals.current = mainCont;

		downloadQueue = {}, xhrRequest = {}, xhrCount = {};
		downloadQueue.sponsors = [], xhrRequest.sponsors = [], xhrCount.sponsors = 0;
		downloadQueue.speakers = [], xhrRequest.speakers = [], xhrCount.speakers = 0;
		downloadQueue.exhibitors = [], xhrRequest.exhibitors = [], xhrCount.exhibitors = 0;
		//downloadQueue.coaches = [],xhrRequest.coaches =[],xhrCount.coaches = 0;
		//downloadQueue.organizers = [],xhrRequest.organizers =[],xhrCount.organizers = 0;

		//var url = "http://www.eventrize.com/swdubai/api/events/get_event/?id=6";
		var url = Alloy.Globals.APIURL;
		var xhr = Ti.Network.createHTTPClient({
			onload : loadData,
			onerror : error,
			timeout : 10000
		});
		xhr.open("GET", url);
		xhr.send();

	} else {
		Alloy.Globals.Log("data already loaded ,and  show time runs ");
		Alloy.Globals.jsonData = JSON.parse(cache.read());
		show_time(0);
	}

}

function loadData(e) {

	data = JSON.parse(this.responseText).event;

	sponsors = data.sponsors;
	speakers = data.speakers;
	exhibitors = data.exhibitors;
	//coaches = data.coaches;
	//organizers = data.organizers;

	//get sponsors photos
	for ( i = 0; i < sponsors.length; i++) {
		downloadQueue.sponsors.push(sponsors[i].sponsor_image);
	}

	//get speakers photos
	for ( i = 0; i < speakers.length; i++) {
		downloadQueue.speakers.push(speakers[i].speaker_image);
	}

	//get exhibitors photos
	for ( i = 0; i < exhibitors.length; i++) {
		downloadQueue.exhibitors.push(exhibitors[i].exhibitor_image);
		//Alloy.Globals.Log(exhibitors[i].exhibitor_website);

		data.exhibitors[i].exhibitor_social.unshift({
			stack_title : "website",
			social_url : exhibitors[i].exhibitor_website
		});

	}
	/*
	//get coaches photos
	for(i=0;i<coaches.length;i++){
	downloadQueue.coaches.push(coaches[i].coach_image);
	}

	//get organizers photos
	for(i=0;i<organizers.length;i++){
	downloadQueue.organizers.push(organizers[i].organizer_image);
	}
	*/

	//Alloy.Globals.Log(downloadQueue);

	//loadthenextFile("sponsors");
	Alloy.Globals.Log('is it looping ');
	loadthenextFile(down_start);
	$.loading.setMessage(L('sponsors'));

	Alloy.Globals.jsonData = data;

}

function error(e) {
	//Ti.API.debug(e.error);
	var toast = Ti.UI.createNotification({
		message : L('notf_toast'),
		duration : Ti.UI.NOTIFICATION_DURATION_LONG
	});
	toast.show();
	setTimeout(function(e) {
		start(1);
	}, 3000);

}

function loadthenextFile(type) {
	//Alloy.Globals.Log(downloadQueue[type]);

	if (xhrCount[type] > 0) {
		downloadQueue[type][xhrCount - 1] == null;
	}

	Alloy.Globals.Log('loadthenextFile type: ' + type);

	if (xhrCount[type] < downloadQueue[type].length) {
		var fileUrl = downloadQueue[type][xhrCount[type]];

		var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
		fileName = type + "_" + xhrCount[type] + "_" + fileName;

		retrieveData({
			type : type,
			URL : fileUrl,
			fileName : fileName,
			folderName : rootDir,
			index : xhrCount[type]
		});

		xhrCount[type]++;
	} else {
		if (type == "sponsors") {
			$.loading.setMessage(L('speakers'));
			loadthenextFile("speakers");
		} else if (type == "speakers") {
			$.loading.setMessage(L('exhibitors'));
			loadthenextFile("exhibitors");
		}/* else if(type == "exhibitors"){
			 $.loading.setMessage("Coaches");
			 loadthenextFile("coaches");
			 }else if(type == "coaches"){
			 $.loading.setMessage("Organizers");
			 loadthenextFile("organizers");
			 }*/
			else
			show_time();
	}
};

function retrieveData(params) {
	var url = params.URL;
	var type = params.type;

	xhrRequest[type][xhrCount[type]] = Ti.Network.createHTTPClient();

	xhrRequest[type][xhrCount[type]].onerror = function() {
		error(e);
		xhrRequest[type][xhrCount[type]] = null;
		// need to null out the request on failure or success
	};
	xhrRequest[type][xhrCount[type]].onload = function() {

		SaveFile(params.folderName, params.fileName, this.responseData, params.index, type);

		xhrRequest[type][xhrCount[type]] = null;

		loadthenextFile(type);
	};

	xhrRequest[type][xhrCount[type]].open('GET', url);
	xhrRequest[type][xhrCount[type]].send();

};

function SaveFile(foldername, filename, response, index, type) {

	

	if (response.type == 1) {
		var f = Ti.Filesystem.getFile(response.nativePath);
		var dest = Ti.Filesystem.getFile(foldername, "images", type, filename);

		if (dest.exists()) {
			dest.deleteFile();
		}

		f.move(dest.nativePath);

		f = null;
		dest = null;
	} else {

		var g = Ti.Filesystem.getFile(foldername, "images", type);
		if (!g.exists()) {
			g.createDirectory();
		};

		var dest = Ti.Filesystem.getFile(foldername, "images", type, filename);
		dest.write(response);
		//images[index]=
		Alloy.Globals.jsonData[type][index].image = dest.nativePath;
		dest = null;
	}
}

function show_time(connected) {
	connected = typeof connected !== 'undefined' ? connected : 1;
	if (connected == 1)
		cache.write(JSON.stringify(Alloy.Globals.jsonData));

	$.headerbar.setTitle({
		text : Alloy.Globals.AppTitle,
		color : Alloy.Globals.HbColor
	});
	$.main = Alloy.createController('main', {
		cache : cache
	});
	main_view = $.main.getView();
	$.indexcont.add(main_view);

	$.loading.stop();
	$.index.remove($.loading.getView());
}

$.index.addEventListener("androidback", function(e) {
	
	if (Alloy.Globals.isOpen) {
		toggleMenu();
	} else if (Alloy.Globals.current == "personDetails"&&Alloy.Globals.ref !="sdetails") {

		Alloy.Globals.currentSection.trigger("nav", {
			name : "persons",
			type : Alloy.Globals.currentType
		});

	}else if (Alloy.Globals.current == "scheduleDetails") {

		Alloy.Globals.currentSection.trigger("nav", {
			name : "schedule",
			type : Alloy.Globals.currentType
		});

	}else if(Alloy.Globals.ref =="sdetails"&&!Alloy.Globals.person){
			Alloy.Globals.currentSection.trigger("nav",{name:"schedule",type:"nodetails"});
			Alloy.Globals.ref ="";
			Alloy.Globals.wasperson = false;
		}
		else if(Alloy.Globals.person&&Alloy.Globals.ref =="sdetails"){
			var data = {
		name:"scheduleDetails",
		type:'',//df[data_type].jsonindex,
		index:Alloy.Globals.currentrow,
		day:Alloy.Globals.currentday
	};
	
	Alloy.Globals.currentSection.trigger("nav",data);
			Alloy.Globals.ref ="sdetails";
			Alloy.Globals.person=false;
		}
	 else if (Alloy.Globals.current == "home") {
		//$.index.close();
		var activity = Titanium.Android.currentActivity;
		activity.finish();
	} else {

		Alloy.Globals.setABTitle({
			text : Alloy.Globals.AppTitle,
			color : Alloy.Globals.HbColor
		});
		Alloy.Globals.currentSection.trigger("nav", {
			name : "home",
			type : "nodetails"
		});
		Ti.App.fireEvent("app:tabs_item", {
			item : "home"
		});
		Ti.App.fireEvent("app:menu_click", {
			item : "home"
		});
	}
});

