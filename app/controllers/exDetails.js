

var data = arguments[0] || {};
var social_list = data.custom_fields.info_social_list;
$.heading.text = data.title;
$.logo.image = data.image;


// Social Links

if(social_list){
	var iconsNo = social_list.length;
	var barWidth = (iconsNo*16)+((iconsNo-1)*8); 
	
	$.socialbar.width=barWidth+"dp";

	var social_left =0;
	
	
	//Alloy.Globals.Log(social_list);
	_.each(social_list, function(item) {
		var social_img = Ti.UI.createImageView({
			image:"/images/"+item.stack_title+".png",
			id:item.stack_title
		});
		
		$.addClass(social_img,'social');
		
		social_img.applyProperties({
			left:social_left+"dp"
		});
		
		social_left+=24;
		
		social_img.addEventListener("click",function(e){
			Alloy.Globals.Log(item.social_url);
			if(item.stack_title == "email"){
				var emailDialog = Ti.UI.createEmailDialog();
				emailDialog.subject = "[Contact Form] Via EgyptOn App";
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

var exbackground =  data.custom_fields.info_short_desc_text;
var exservices = "";
var excontact = "";

$.bio.text = exbackground;

_.each(data.custom_fields.info_extend_detail,function(detail) {
	if(detail.name == "services")
		exservices = detail.value;
	else
		excontact = detail.value;
});

 
HeaderView = function(options) {
	var self = Ti.UI.createView(_.extend({
		height:35,
		top:5,
		//borderColor:"red",
		//borderWidth:1
	}, options.viewArgs || {}));
	
	//var fauxShadow = new FauxShadow();
	//self.add(fauxShadow);
	
	var indicator = Ti.UI.createView({
		top:0,
		right:(options.optionWidth*(options.options.length-1))+'%',
		bottom:1,
		width:options.optionWidth+'%',
		backgroundColor:'white',
		opacity:"0.6"
	});
	self.add(indicator);
	
	var title = Ti.UI.createLabel({
		text:options.title,
		color:'#000',
		left:10,
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		font: {
			fontSize:14,
			fontWeight:"bold"
		}
	});
	self.add(title);
	
	//Create a styled menu option
	function option(t,idx,lcolor) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'%';
		
		var v = Ti.UI.createView({
			//width:options.optionWidth+'dp',
			width:"25%",
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
				fontSize:12
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
				l.color="#840042";
			});
		});
		
		
		return v;
	}
	
	exTabs = [];
	//Create menu options for each option requested
	for (var i=0, l=options.options.length; i<l; i++) {
		exTabs[i]=option(options.options[i], i,options.defcolors[i]);
		self.add(exTabs[i]);
	}
	
	self.on("change",function(e){
		for (var i=0, l=exTabs.length; i<l; i++) {
			//Alloy.Globals.Log(exTabs[i].id);
			if(e.selection != exTabs[i].id)
				exTabs[i].children[0].color = "white";
		}
	});
	
	//Add common shortcut to addEventListener
	self.on = function(ev,cb) {
		self.addEventListener(ev,cb);
	};
	
	//Shift indicator to desired index
	self.goTo = function(idx) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'%';
		indicator.right = rightOffset;
		
	};
	
	return self;
};

	$.headerView = HeaderView({
		title:'Exhibitor :',
		optionWidth:25,
		options:['Background', 'Services', 'Contact'],
		defcolors:['#840042','#fff','#fff']
	});
	//$.pagecontent.add($.headerView);
	$.tabbar.add($.headerView);
	
	$.headerView.on('change', function(e) {
		if (e.selection === 'Background') {
			//$.agendaTable.setData(sunday);
			Alloy.Globals.Log("background");
			$.bio.setText(exbackground);
		}
		else if (e.selection === 'Services') {
			//$.agendaTable.setData(monday);
			Alloy.Globals.Log("services");
			$.bio.setText(exservices);
		}
		else {
			//$.agendaTable.setData(tuesday);
			Alloy.Globals.Log("contact");
			$.bio.setText(excontact);
		}
		$.contentView.scrollTo(0,0);
	});
	
	//reset to day one if need be, since Android will not retain animation positions when a view has been unloaded from the hierarchy
	/*
	$.on('focus', function() {
		if ($.agendaTable && sunday.length > 0) {
			$.agendaTable && ($.agendaTable.setData(sunday));
			$.headerView.goTo(0);
		}
	});
	*/
	
