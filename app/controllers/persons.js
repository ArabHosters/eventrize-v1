var df = Alloy.Globals.dataFormat;
var args = arguments[0];
var data_type = args.type;
var data = Alloy.Globals.jsonData[df[data_type].jsonindex];

var counter  = 0 ; 
var persons_rows = [];
_.each(data,function(person,index) {
	
	
  persons_rows.push(new Alloy.Globals.PersonRow(person,person.speaker_id,df,data_type,data.length,counter));
  counter++;
});

$.contentView.setData(persons_rows);



$.contentView.on("click",function(e){
	var data = {
		name:df[data_type].contDetails,
		type:df[data_type].jsonindex,
		index:e.row.pid
	};
	
	Alloy.Globals.currentSection.trigger("nav",data);
});

