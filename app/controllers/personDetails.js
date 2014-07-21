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
	
	$.bio.textAlign = 'left';
}

var df = Alloy.Globals.dataFormat;
var args = arguments[0];
var data_type = args.type;
var id = args.index;
var index ;


	
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
	
$.bio.text = data[df[data_type].bio];
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




