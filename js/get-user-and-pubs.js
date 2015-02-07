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

                getDrink(function(drink){
                    console.log(drink);
                });


                pubArray[i] = {
                    Name: res[0],
                    Lat: pubData[i].lat,
                    Long: pubData[i].lon,
                    PlaceId: pubData[i].place_id,
                    Drink: drink.drink,
                    Par: drink.par
                };

                //console.log(pubArray[i]);
                
            }
        callback(pubArray);

        });
}

function getDrink(callback){
    var drinkArray = [
        {drink: "Vodka Lemonade", par: 2}, 
        {drink: "Jägerbomb", par: 1}, 
        {drink: "Pint of Beer", par: 3}, 
        {drink: "Large Wine (Red or White)", par: 2}, 
        {drink: "Pint of Cider", par: 3}, 
        {drink: "2x Alcopop", par: 2}, 
        {drink: "Gin and Tonic", par: 2}, 
        {drink: "Tequilla Shot", par: 1}, 
        {drink: "Rum and Coke", par: 2}, 
        {drink: "Neat Whiskey Shot", par: 1}
    ];

    var i = Math.floor(Math.random() * drinkArray.length);
    callback(drinkArray[i]);
}

function getPubsFromUserLocation(postCode, numPubs, callback){
	var data = {};

	whereAreYou(postCode, function(location){
		data.location = location;

		getPubs(location.City, numPubs, function(pubs){
			
			data.pubs = pubs;
			//console.log(location);
			//console.log(pubs);
          callback(data);

		});

	});



}