var startLat;
var startLon;
var map;
var routing;

var map = L.map('map').setView([51.5, 0.1167], 13);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-i875mjb7'
}).addTo(map);

function CalculateRoute(postcode, holeNum) {

    getPubsFromUserLocation(postcode, 30, function (e) {

        startLat = e.location.Latitude;
        startLon = e.location.Longitude;

        map.setView([startLat, startLon], 13);

        var name;
        var waypoints = [L.latLng(startLat, startLon)];

        for (var i = 0; i < e.pubs.length - 1; i++) {

            name = e.pubs[i].Name.split(",")[0];

            waypoints[i + 1] = L.latLng(e.pubs[i].Lat, e.pubs[i].Long);
            waypoints[i + 1].name = name;
            waypoints[i + 1].drink = e.pubs[i].Drink;
            waypoints[i + 1].par = e.pubs[i].Par;

        }
        routing = L.Routing.control({
            plan: L.Routing.plan(getClosestPubs(waypoints, holeNum), {
                createMarker: function (i, wp) {
                    return calculateMarkers(i, wp);
                }
            }),
            draggableWaypoints: false,
            addWaypoints: false
        }).addTo(map);


    });

};

function calculateMarkers(i, wp) {

    var icnPath = 'icons/golf_hole.png';
    var label = "<strong>Hole " + i + ": " + wp.latLng.name + "</strong><br />" + wp.latLng.drink + ", par " + wp.latLng.par;

    if (i === 0) {
        icnPath = 'icons/timer.jpg';
        label = "<strong>Start</strong>";
    }

    var icn = L.icon({
        iconUrl: icnPath,
        iconSize: [24, 24]
    });

    var popup = L.popup()
        .setLatLng(wp.latLng)
        .setContent(label)

    map.addLayer(popup);

    return L.marker(wp.latLng, {
        icon: icn,
        bindPopup: popup
    });
}

function getClosestPubs(waypoints, pubNumber) {

    for (var i = 0; i < waypoints.length - 1; i++) {
        waypoints[i].distance = getDistanceFromLatLonInKm(startLat, startLon, waypoints[i].lat, waypoints[i].lng);
    }

    waypoints.sort(SortByDist);

    if (waypoints.length > pubNumber) {
        waypoints = waypoints.slice(0, pubNumber);
    }

    return waypoints;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function SortByDist(a, b) {
    var aDist = a.distance;
    var bDist = b.distance;
    return ((aDist < bDist) ? -1 : ((aDist > bDist) ? 1 : 0));
}