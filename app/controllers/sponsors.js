var df = Alloy.Globals.dataFormat;

var args = arguments[0];
var data_type = args.type;
var index = args.index;

var data = Alloy.Globals.jsonData[df[data_type].jsonindex];

function PersonRow(person, pid) {

	Ti.API.info('preson: ' + JSON.stringify(person));
	var self = Ti.UI.createTableViewRow({
		selectedBackgroundColor : '#cdcdcd',
		className : 'personRow',
		layout : "vertical",
		url : person.sponsor_website,
		
	});
	//self.personObject = person;

	// person photo
	var photo = Ti.UI.createImageView({
		image : person.sponsor_image,
		top : 5,
		bottom : 5,
		defaultImage : "/img/eventrize-logo.png",
		//left:10,
		//width:150,
		//height:60,
		//width : Ti.UI.SIZE,
		//height : Ti.UI.SIZE,
		//borderRadius:60,
		// center : {
			// x : 0,
			// y : "50%"
		// },
		//borderWidth:'1',borderColor:'#611F53'
	});
	self.add(photo);

	return self;
}

var sponsersx = {};

for (var i = 0; i < data.length; i++) {
	if (sponsersx[data[i].sponsor_category] == undefined) {
		sponsersx[data[i].sponsor_category] = [];
	}
	sponsersx[data[i].sponsor_category].push(new PersonRow(data[i],i));

}
Ti.API.info('sposers '+JSON.stringify(sponsersx));

function SectionHeader(title) {

	var label = Ti.UI.createLabel({
		html : "<i>" + title + "</i>",
		backgroundColor : Alloy.Globals.sponsors.labelBG,
		color : Alloy.Globals.sponsors.labelColor,
		font : {
			fontSize : Alloy.Globals.sponsors.labelSize + "dp",
			fontWeight : "bold"
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "100%",
		height : 50
	});

	return label;
}

for (i in sponsersx) {
	$.contentView.appendSection(Ti.UI.createTableViewSection({
		headerView : new SectionHeader(i)
	}));
	$.contentView.appendRow(sponsersx[i]);
}

$.contentView.on("click", function(e) {
	var url = e.row.url;
	Ti.API.info('url; '+url);
	if (url) {
		if (url[0] != 'h') {
			url = "http://" + url;
			Ti.Platform.openURL(url);
		} else {
			Ti.Platform.openURL(url);
		}
	}
	//Ti.Platform.openURL(e.row.url);

});

