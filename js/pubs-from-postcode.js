function pubsFromPostcode(postCode, numPubs) {
    postcode = postCode;
    userLocation = "http://api.postcodes.io/postcodes/" + postcode;
    userLat = "";
    userLong = "";
    userArea = "";
    numOfPubs = numPubs;

    $.ajax({
        url: userLocation,
        context: document.body
    }).done(function(data) {

        // Uncomment to output all pub data for the 
        //console.log(data.result);

        user = {
            Latitude: data.result.latitude,
            Longitude: data.result.longitude,
            City: data.result.admin_district
        };

        console.log(user);


        userLat = data.result.latitude;
        userLong = data.result.longitude;
        userArea = data.result.admin_district; // Should output city name: Portsmouth, Newcastle, Glasgow, etc
        console.log(userLat);
        console.log(userLong);

        var pubUrl = "http://nominatim.openstreetmap.org/search?format=json&q=" + userArea + "+pubs&limit=" + numOfPubs; // URL includes

        $.ajax({
            url: pubUrl,
            context: document.body
        }).done(function(pubData) {

            //Uncomment to output all pub data for the 
            //console.log(dataTwo);

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

                console.log(pubArray[i]);
                //return pubArray;

            }


        });
    });


}