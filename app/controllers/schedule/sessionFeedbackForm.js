/*
	var rate = 0;
	
	var ratingBar = Alloy.Globals.ratingbar.createRatingBar({		 
		rating : rate,
	 	stars : 5,
	 	stepSize : 1,
		isIndicator : false
	});
	
	
	$.fbRatingbar.add(ratingBar);
	
	
	ratingBar.addEventListener('change', function(e) {
	    rate = e.rating.toString();
	});

	 $.fbSubmit.addEventListener("click",function(e){
	 	
	 	if(rate == 0){
	 		alert("Please rate from 1 to 5 !");
	 	}else{
	 		fbComment = $.fbComment.value;
	 		review = {"rating":rate,"comment":fbComment};
	 		reviewJson = JSON.stringify(review);
	 		var Feedfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,"feedback.json");
	 		
	 		
	 		var submitReviewUrl = "http://www.eventrize.com/dsoa/api/submit_review/?post_id="+Alloy.Globals.currentSessionId+"&content="+fbComment+"&rating="+rate+"&name=eventrize&email=eventrize@eventrize.com";
	 		
			var xhr = Ti.Network.createHTTPClient({
			    onload: function(e) {
			    	Feedfile.write(reviewJson);
					Ti.App.fireEvent('app:reviewed');
			    },
			    onerror: function(e){
			    	alert("Error in internet connection, re-submit your review !");
			    },
			    timeout:10000  
			});
			xhr.open("GET", submitReviewUrl);
			xhr.send();
	 		
	 		
			
		
	 	}
	 	
	 });

*/