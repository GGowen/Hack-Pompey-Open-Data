function whereAreYou(postCode, callback){
	userLocation = "http://api.postcodes.io/postcodes/" + postCode;
	user = "";

	$.ajax({
        url: userLocation,
        context: document.body
    }).done(function(data) {
    	user = {
            Latitude: data.result.latitude,
            Longitude: data.result.longitude,
            City: data.result.admin_district
        };

        //console.log(user);
        callback(user);
    });
}

function getPubs(city, numPubs, callback){
	pubLocation = "http://nominatim.openstreetmap.org/search?format=json&q=" + city + "+pubs&limit=" + numPubs;
	
	$.ajax({
            url: pubLocation,
            context: document.body
        }).done(function(pubData) {

        	//Uncomment to output all pub data for the 
            //console.log(pubData);

            pubArray = [];

            for (var i = 0, len = pubData.length; i < len; i++) {
                name = pubData[i].display_name;
                res = name.split(",");
                end = (res.length) - 2;


                pubArray[i] = {
                    Name: res[0],
                    Lat: pubData[i].lat,
                    Long: pubData[i].lon,
                    PlaceId: pubData[i].place_id
                };

                //console.log(pubArray[i]);
                
            }
        callback(pubArray);

        });
}

function getPubsFromUserLocation(postCode, numPubs){
	var data = {};

	whereAreYou(postCode, function(location){
		data.location = location;

		getPubs(location.City, numPubs, function(pubs){
			
			data.pubs = pubs;
			console.log(location);
			console.log(pubs);

		});

	});

}