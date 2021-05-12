let mymap = L.map('mapid').setView([51.505, -0.09], 13); 

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
}).addTo(mymap);

let containers;
let containerMarkers = L.markerClusterGroup();

const socket = io.connect('http://localhost:3000')

socket.on('getcontainers', data => 
{
        containers = new Map(JSON.parse(data));        
        render();
})

socket.on('update_containers', data => 
{
        container = JSON.parse(data);
        containers.set(container.id, container);
        render();
})

socket.on('delete', data => 
{
        console.log(data);
})

function render()
{
        containerMarkers.clearLayers();
        containers.forEach((element, key, map) => 
        {
                let marker = L.marker([element.longitude, element.latitude]);
                marker.bindPopup(`<b>fullness:</b><br>${element.fullness}.`).openPopup();
                containerMarkers.addLayer(marker);
        });
        mymap.addLayer(containerMarkers);
}

// let marker = L.marker([51.5, -0.09]).addTo(mymap);


// let circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);


// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(mymap);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");