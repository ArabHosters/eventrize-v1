	var data = arguments[0] || {};

	$.heading.text=data.title;
	$.bio.html=data.content;
	$.scrollcontent.scrollTo(0,0);
	
	var social_list = data.social;
	
	var iconsNo = social_list.length;
	var barWidth = (iconsNo*16)+((iconsNo-1)*8); 
	
	$.socialbar.width=barWidth+"dp";

	var social_left =0;
	
	_.each(social_list, function(item) {
		var social_img = Ti.UI.createImageView({
			image:"/images/"+item.type+".png",
			id:item.value
		});
		
		$.addClass(social_img,'social');
		
		social_img.applyProperties({
			left:social_left+"dp"
		});
		
		social_left+=24;
		
		social_img.addEventListener("click",function(e){
			Alloy.Globals.Log(item.value);
			if(item.type == "email"){
				var emailDialog = Ti.UI.createEmailDialog();
				emailDialog.subject = "[Contact Form] Via EgyptOn App";
				emailDialog.toRecipients = [item.value];
				emailDialog.open();	
			}else{
				Ti.Platform.openURL(item.value);					
			}
			
		});
		
		$.socialbar.add(social_img);
	
	});
