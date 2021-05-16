let mymap = L.map('map').setView([51.505, -0.09], 13); 

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
}).addTo(mymap);

let containers;
let containerMarkers = L.markerClusterGroup();

const socket = io.connect('https://iot-smart-garbage-container.herokuapp.com')
//const socket = io.connect('http://localhost:3000')

socket.on('getcontainers', data => 
{
        containers = new Map(JSON.parse(data));
        console.log(containers);
        render();
})

socket.on('update_containers', data => 
{
        container = JSON.parse(data);
        containers.set(container.id, container);
        console.log(containers);
        render();
})

socket.on('delete_container', data => 
{
        container = JSON.parse(data);
        containers.delete(container);
        console.log(containers);
        render();
})

function render()
{
        containerMarkers.clearLayers();
        containers.forEach((element, key, map) => 
        {
                let marker = L.marker([element.longitude, element.latitude], {icon: containerIcon});
                marker.on('click', (e) =>
                {
                        getInfoViewPanel(element);
                })
                //marker.bindPopup(`<b>fullness:</b><br>${element.fullness}.`).openPopup();
                containerMarkers.addLayer(marker);
        });
        mymap.addLayer(containerMarkers);
}

// let marker = L.marker([51.5, -0.09]).addTo(mymap);


function getInfoViewPanel(container)
{
        let panel = document.getElementById("myForm");
        panel.innerHTML = 
        `<form class="form-container">
                <h1>Container ID: ${container.id}</h1>
                <label><b>fullness:</b></label>
                <label>${container.fullness}</label>

                <p>
                        <label><b>latitude:</b></label>
                        <label>${container.latitude}<br></label>

                        <label><b>longitude:</b></label>
                        <label>${container.longitude}<br></label>
                </p>
        </form>`;
        panel.style.display = "block";
}

const containerIcon = L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa('container.svg')}`
    
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

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