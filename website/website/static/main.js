// Leaflet Map object
const map = L.map("map").setView([60.1691, 24.9415], 13);

// Add OSM as map source
const basemap = L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
}).addTo(map);


// Create a heatmap layer
let heatArray = [];
let points = getData();
points.map(marker => heatArray.push([marker.latitude, marker.longitude, marker.amount]));
// Heatmap options
const heat = L.heatLayer(heatArray, {blur: 5, max: 30, radius: 7});

// Add markers to a layer
let ticketArray = [];
points.map(marker => {
    ticketArray.push(L.circleMarker(L.latLng(marker.latitude, marker.longitude), { radius: 2, color: "#D0021B", weight: 1, fillOpacity: 1 }));
});

// Add parking spots to a layer
let parkingArray = [];
let parkingSpots = getParking();
parkingSpots.map(p => {
    parkingArray.push(L.geoJSON(p, { color: "#417505", weight: 2 }));
});

let serviceClusterArray = [];
let clusters = getServiceClusters();
clusters.map(p => {
	serviceClusterArray.push(L.circleMarker(L.latLng(p.latitude, p.longitude), {radius: (p.count/6)+2, color: "#00DDDD", weight: 1, fillOpacity: 1}));
});

let heatmapLayer = L.layerGroup([heat]);
let ticketsLayer = L.layerGroup(ticketArray);
let parkingLayer = L.layerGroup(parkingArray);
let serviceClusterLayer = L.layerGroup(serviceClusterArray);

const baseMaps = {
    //"Basemap": basemap,
};

const overlayMaps = {
    "Tickets": ticketsLayer,
    "Heatmap": heatmapLayer,
    "Parking": parkingLayer,
    "ServiceClusters": serviceClusterLayer
};



L.control.layers(baseMaps, overlayMaps).addTo(map);
