var event = Alloy.Globals.jsonData.custom_fields;
var gmap = event.info_gmap;
var lat = gmap.substr(0, gmap.indexOf(","));
var lon = gmap.substr(gmap.indexOf(",") + 1);

var address = event.info_location;
var main_address = address.substr(0, address.indexOf("-----"));
var sub_address = address.substr(address.indexOf("-----") + 5);

var MapModule = Alloy.Globals.Map;

var venue = MapModule.createAnnotation({
	latitude : lat,
	longitude : lon,
	title : main_address,
	subtitle : sub_address,
	animate : true,
	leftButton : "/img/location.jpg"
});

$.mapview.region = {
	latitude : lat,
	longitude : lon,
	latitudeDelta : 0.05,
	longitudeDelta : 0.05
};

$.mapview.addAnnotation(venue);
$.mapview.selectAnnotation(venue);

$.mapview.addEventListener('click', function(e) {
	// get event properties
	//get the Myid from annotation
	var clicksource = e.clicksource;

	if (clicksource == 'subtitle' || clicksource == 'leftPane') {//leftButton event
		if (Titanium.Geolocation.locationServicesEnabled === false) {
			alert('Your device has GPS turned off. Please turn it on.');
		} else {

			Titanium.Geolocation.getCurrentPosition(function(e) {
				Ti.API.info(JSON.stringify(e));
				//Error locating device position go to default position
				if (e.error) {
					var latitude = lat;
					var longitude = lon;
				} else {
					var longitude = e.coords.longitude;
					var latitude = e.coords.latitude;
				}

				var sourceAddress = latitude + "," + longitude;
				var destinationAddress = lat + "," + lon;
				Ti.Platform.openURL('http://maps.google.com/maps?t=m&saddr=' + sourceAddress + '&daddr=' + destinationAddress);
			});
		}
	}

});

/*venue.addEventListener("click",function(e){
 Titanium.Geolocation.getCurrentPosition(function(e){
 //Error locating device position go to default position
 if (e.error)
 {
 var latitude = lat;
 var longitude = lon;
 }
 else{
 var longitude = e.coords.longitude;
 var latitude = e.coords.latitude;
 }

 var sourceAddress = latitude+","+longitude;
 var destinationAddress = lat+","+lon;
 Ti.Platform.openURL('http://maps.google.com/maps?t=m&saddr=' +sourceAddress + '&daddr=' + destinationAddress);
 });
 });*/

var rc = MapModule.isGooglePlayServicesAvailable();
switch (rc) {
case MapModule.SUCCESS:
	Alloy.Globals.Log('Google Play services is installed.');
	break;
case MapModule.SERVICE_MISSING:
	alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
	break;
case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
	alert('Google Play services is out of date. Please update Google Play services.');
	break;
case MapModule.SERVICE_DISABLED:
	alert('Google Play services is disabled. Please enable Google Play services.');
	break;
case MapModule.SERVICE_INVALID:
	alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
	break;
default:
	alert('Unknown error. Contact Administrator');
	break;
}

