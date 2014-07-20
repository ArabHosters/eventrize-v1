var df = Alloy.Globals.dataFormat;

var args = arguments[0];
var data_type = args.type;
var index = args.index;

var data = Alloy.Globals.jsonData[df[data_type].jsonindex];
 
 

function PersonRow(person,pid) {
	var self = Ti.UI.createTableViewRow({
		height:Ti.UI.SIZE,
		//height:"100dp",
		selectedBackgroundColor:'#cdcdcd',
		className:'personRow',
		layout:"vertical",
		url:person.sponsor_website,		
		//borderColor:"blue",borderWidth:1
	});
	self.personObject = person;
	
	// person photo
	self.add(Ti.UI.createImageView({
		image:person.image,
		top:'5dp',
		bottom:'5dp',
		//left:'10dp',
		//width:'150dp',
		//height:'60dp',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		//borderRadius:60,
		center:{x:0,y:"50%"},
		//borderWidth:'1',borderColor:'#611F53'
	}));
	
	return self;
}
var sponsors = {
	Platinum:[],
	Gold:[],
	Silver:[],
	Technology:[],
	Media:[]
};
_.each(data,function(person,index) {
	category = person['sponsor_category'];
	sponsors[category].push(new PersonRow(person,index));
});



function SectionHeader(title){
	
	var label = Ti.UI.createLabel({
		html:"<i>"+title+"</i>",
		backgroundColor:Alloy.Globals.sponsors.labelBG,
		color:Alloy.Globals.sponsors.labelColor,
		font:{
			fontSize:Alloy.Globals.sponsors.labelSize+"dp",
			fontWeight:"bold"
		},
		textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
		width:"100%",
		height:"50dp"
	});
	
	
	
	return label;
}

for (i in sponsors){
$.contentView.appendSection(Ti.UI.createTableViewSection({ headerView: new SectionHeader(L(i)) }));
$.contentView.appendRow(sponsors[i]);
}

$.contentView.on("click",function(e){
	
	Ti.Platform.openURL(e.row.url);
	
});

