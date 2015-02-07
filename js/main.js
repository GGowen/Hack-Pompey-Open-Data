var startLat = "50.789258180787506";
var startLon = "-1.0723918339063396";
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

$.ajax({
    url: "http://nominatim.openstreetmap.org/search?format=json&q=portsmouth+pubs&limit=30",
    context: document.body
}).done(function (e) {

    var name;
    var waypoints = [];

    for (var i = 0; i < e.length - 1; i++) {

        name = e[i].display_name.split(",")[0];

        waypoints[i] = L.latLng(e[i].lat, e[i].lon);

    }
    routing = L.Routing.control({
        plan: L.Routing.plan(getClosestPubs(waypoints, 9), {
            createMarker: function (i, wp) {
                return calculateMarkers(i, wp);
            }
        })
    }).addTo(map);

});

function calculateMarkers(i, wp) {

    var icn = L.icon({
        iconUrl: 'images/hole.png',

        iconSize: [24, 24], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    return L.marker(wp.latLng, {
        icon: icn
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