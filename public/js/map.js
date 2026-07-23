const mapDiv = document.getElementById('map');
const coordinates = JSON.parse(mapDiv.dataset.coordinates);
const title = mapDiv.dataset.title;

var map = L.map('map').setView(coordinates, 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker(coordinates)
  .addTo(map)
  .bindPopup(title)
  .openPopup();