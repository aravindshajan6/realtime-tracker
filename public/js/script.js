const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    },
(error) => {
    console.log(error);
},
{
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
})
}

const map = L.map('map').setView([51.505, -0.09], 13);
// Add a tile layer to the map (e.g., OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© Hello World'
}).addTo(map);

// Optionally, add other layers or markers to the map
// L.marker([51.505, -0.09]).addTo(map)
//     .bindPopup('You are here.')
//     .openPopup();

const markers = {};

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 16);
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
 });

 socket.on("user-disconnected", (id) => {
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
 })