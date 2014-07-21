var langar = Alloy.Globals.currentLang == 'ar' ; 

if(Alloy.Globals.currentLang == 'ar')
{
// will not do a thing cause it's default is set on arabic mood.
	
}
else // english mood
{
	$.menu.left = "-85%";
}



var df = Alloy.Globals.dataFormat;
var menu = Alloy.Globals.Menu;

MenuRow = function(params){
	var mtitle = params.item.title;
	var mcont = params.item.controller;
	//var micon = params.item.icon;
	
	var micon = (params.index == 0)?mcont+"-pressed":mcont;
	Alloy.Globals.Log('micon: '+micon);
	var mcolor = (params.index == 0)?Alloy.Globals.menuConf.mcolor1:Alloy.Globals.menuConf.mcolor0;
	
	var row = $.UI.create('TableViewRow',{
		rowid:mcont,
		rowindex:params.index,
		classes:"items_rows"
	});
	 
	var rowcont = $.UI.create('View',{
		classes:"row_cont"
	});
	
	var icon = $.UI.create('ImageView',{
		classes:"items_img",
		//image:micon
		image:"/img/icons/"+micon+".png"
		
	});	
	if (!langar){
		icon.right = null; 
		icon.left = 10 ; 
	}
	rowcont.add(icon);
	
	var title = $.UI.create('Label',{
		classes:"items",
		text:mtitle,
		color:mcolor
		
	});
	if (!langar){
		title.right = null; 
		title.left = 45 ;
		title.textAlign = "left"; 
	}
	rowcont.add(title);
	
	row.add(rowcont);
	
	var sep1= $.UI.create('ImageView',{
		classes:"sep1"
	});
		
	var sep2= $.UI.create('ImageView',{
		classes:"sep2"
	});
	
	row.add(sep1);
	row.add(sep2);
	 
	return row;
};

var menu_rows = [];
_.each(menu,function(item,index){
	menu_rows.push(MenuRow({index:index,item:item}));
	
});

$.menu_table.setData(menu_rows);

var old_row=menu_rows[0];

Ti.App.addEventListener("app:tabs_item",function(e){
	item = e.item;
	
	_.each(menu_rows,function(row,index){
		
		
		if(row.rowid == item )
		{
			
			old_row.children[0].children[0].image = "/img/icons/"+old_row.rowid+".png";
			old_row.children[0].children[1].color = "#ccc";
			
			row.children[0].children[0].image = "/img/icons/"+item+"-pressed.png";
			row.children[0].children[1].color = "#e87731";
			
			old_row = row;
			
		}
	});
});


$.menu_table.on('click',function(e){
	item = e.row.rowid ;
	
	
	Ti.App.fireEvent("app:menu_click",{item:item});
	
	// revert old row to it's default
	old_row.children[0].children[0].image = "/img/icons/"+old_row.rowid+".png";
	old_row.children[0].children[1].color = Alloy.Globals.menuConf.mcolor0;
	
	// new row pressed
	Alloy.Globals.Log("/img/icons/"+item+"-pressed.png");
	e.row.children[0].children[0].image = "/img/icons/"+item+"-pressed.png";
	e.row.children[0].children[1].color = Alloy.Globals.menuConf.mcolor1;
	
	
	old_row = e.row;

	Alloy.Globals.setABTitle({text:menu[e.row.rowindex].abtitle,color:Alloy.Globals.HbColor});
	
	if(df[item]){
		var data = {
			name:df[item].controller,
			type:item,
			index:0
		};
		
	}else{			
		var data = {
			name:item,
			type:"nodetails"
		};
	}
	if(Alloy.Globals.isOpen)
		Alloy.Globals.toggleMenu();
		
	Alloy.Globals.currentSection.trigger("nav",data);
	
});

