
/*
var Feedbackfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,"feedback.json");


// no feedback yet
if(Feedbackfile.size == 0){
	
	$.fbComment.text = "Not rated yet !";
	//$.fbSubmit.title = "";
		
}
// feedback exist
else{
	
	
	var content = Feedbackfile.read();	
	var review = JSON.parse(content.text);
	
	var ratingBar = Alloy.Globals.ratingbar.createRatingBar({		 
		rating : review.rating,
	 	stars : 5,
	 	stepSize : 1,
		isIndicator : true
	});
	
	
	$.fbRatingbar.add(ratingBar);
	
	$.fbComment.text = review.comment;
	$.feedback.remove($.fbSubmit);
		
}	

	 
function ratethis(){
	$.popup();
}	 
	

$.popup = function(){ 	

	if(Feedbackfile.size == 0){
		feedbackForm = 	Alloy.createController('schedule/sessionFeedbackForm');
		var dialog = Ti.UI.createAlertDialog({
			androidView:feedbackForm.getView()
		});
		dialog.show();
		Ti.App.addEventListener("app:reviewed",function(e){
			dialog.hide();
		});
		
	}
			
};
 	


*/