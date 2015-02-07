var startLat;
var startLon;
var map = L.map('map').setView([startLat, startLon], 13);
var routing;

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-i875mjb7'
}).addTo(map);

L.marker([startLat, startLon]).addTo(map);

function CalculateRoute(postcode, holeNum) {

getPubsFromUserLocation(postcode, 30, function (e) {});

startLat = e.location.Latitude;
startLon = e.location.Longitude;

var name;
var waypoints = [];

for (var i = 0; i < e.length - 1; i++) {

    name = e[i].display_name.split(",")[0];

    waypoints[i] = L.latLng(e[i].lat, e[i].lon);
    waypoints[i].name = name;

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

function calculateMarkers(i, wp) {

    var icn = L.icon({
        iconUrl: 'icons/hole.png',
        iconSize: [24, 24]
    });

    var popup = L.popup()
        .setLatLng(wp.latLng)
        .setContent("<strong>" + wp.latLng.name + "</strong><br />Hole " + (i + 1))

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