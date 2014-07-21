
var Cloud = require('ti.cloud');

function User() {}

User.confirmLogin = function() {
	var auth = false;
	if (Ti.App.Properties.hasProperty('sessionId')) {
		//set up cloud module to use saved session
		Cloud.sessionId = Ti.App.Properties.getString('sessionId');
		auth = true;
		
	}
	
	return auth;
};


User.login = function(username, password,deviceToken, success, error) {
	if (!Ti.Network.online) {
		error({
			success:false
		});
		return;
	}
	
	var sessionId = '', userDetails;

	Cloud.Users.login({
	    login: username,
	    password: password
	}, function (e) {
	    if (e.success) {
	        userDetails = JSON.stringify(e.users[0]);
            Ti.App.Properties.setString('sessionId', Cloud.sessionId);
            Ti.App.Properties.setString('networkDetails', userDetails);
			
			 Cloud.PushNotifications.subscribe({
			 	channel:'swdubai',
			 	type:'android',
			    device_token: deviceToken
			}, function (e) {
			    if (e.success) {
			        //Alloy.Globals.Log('Subscribe Success');
			    } else {
			        //Alloy.Globals.Log('Subscribe Error:\n' +((e.error && e.message) || JSON.stringify(e)));
			    }
			});
			
			
			success(userDetails);
			
			
			
	    } else {
	        //Ti.API.error('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	        error(e.error);    
	    }
	});	
	
};

User.getUserDetails = function() {
	var deets;
	if (Ti.App.Properties.hasProperty('networkDetails')) {
		try {
			deets = JSON.parse(Ti.App.Properties.getString('networkDetails'));
		}
		catch (e) { 
			Ti.API.error('Error parsing user details: '+e);
		}
	}
	return deets;
};

User.logout = function(cb) {
	if (!Ti.Network.online) {
		cb({
			success:false
		});
		return;
	}
	
	Cloud.Users.logout(function(e) {
		if (e.success) {
		
			Ti.App.Properties.removeProperty('sessionId');
		}
		cb(e);
	});
};


module.exports = User;
