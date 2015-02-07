var map = L.map('map').setView([50.789258180787506, -1.0723918339063396], 13);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-i875mjb7'
}).addTo(map);

$.ajax({
    url: "http://nominatim.openstreetmap.org/search?format=json&q=portsmouth+pubs&limit=30",
    context: document.body
}).done(function (e) {

    for (var i = 0; i < e.length - 1; i++) {
        L.marker([e[i].lat, e[i].lon]).addTo(map)
            .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
    }

});