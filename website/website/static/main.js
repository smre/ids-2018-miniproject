const getData = url => {
    return axios.get(`/api/${url}`)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        });
};

const createHeatmapLayer = () => {
    return getData('ticketAmounts')
        .then(points => {
            let heatArray = [];
            points.data.map(marker => {
                if (marker.latitude !== 'FAIL') {
                    heatArray.push([marker.latitude, marker.longitude, marker.amount])
                }
            });
            // Heatmap options can be set here
            return L.heatLayer(heatArray, {blur: 5, max: 726 / 726, radius: 10});
        });
};

const createTicketLayer = () => {
    return getData('ticketAmounts')
        .then(points => {
            let ticketArray = [];
            points.data.map(marker => {
                if (marker.latitude !== 'FAIL') {
                    ticketArray.push(L.circleMarker(L.latLng(marker.latitude, marker.longitude), {
                        radius: 2,
                        color: "#D0021B",
                        weight: 1,
                        fillOpacity: 1
                    }));
                }
            });
            return ticketArray;
        });
};

const createParkingSpotLayer = () => {
    return getData('parking')
        .then(parkingSpots => {
            let parkingArray = [];
            parkingSpots.data.map(p => {
                parkingArray.push(L.geoJSON(p, {color: "#417505", weight: 2}));
            });
            return parkingArray;
        });
};

const createServiceClustersLayer = () => {
    return getData('serviceClusters')
        .then(clusters => {
            let serviceClusterArray = [];
            clusters.data.map(p => {
                serviceClusterArray.push(L.circleMarker(L.latLng(p.latitude, p.longitude), {
                    radius: (p.count / 6) + 2,
                    color: "#00DDDD",
                    weight: 1,
                    fillOpacity: 1
                }));
            });
            return serviceClusterArray;
        });
};

// Initialize map
// Leaflet Map object
const map = L.map("map").setView([60.1691, 24.9415], 13);

// Add OSM as map source
const basemap = L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and <a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
}).addTo(map);

function createLayers(base) {
    let baseMaps = {
        "Basemap": base,
    };

    let overlayMaps = {};

    let layersControl = L.control.layers(baseMaps, overlayMaps);
    layersControl.addTo(map);

    // Add layers as are fetched from API
    createTicketLayer().then(data => {
        layersControl.remove(map);
        overlayMaps['Tickets'] = L.layerGroup(data);
        layersControl = L.control.layers(baseMaps, overlayMaps);
        layersControl.addTo(map);
    });

    createHeatmapLayer().then(data => {
        layersControl.remove(map);
        overlayMaps['Ticket Heatmap'] = data;
        layersControl = L.control.layers(baseMaps, overlayMaps);
        layersControl.addTo(map);
    });

    createParkingSpotLayer().then(data => {
        layersControl.remove(map);
        overlayMaps['Parking Spots'] = L.layerGroup(data);
        layersControl = L.control.layers(baseMaps, overlayMaps);
        layersControl.addTo(map);
    });

    createServiceClustersLayer().then(data => {
        layersControl.remove(map);
        overlayMaps['Service Clusters'] = L.layerGroup(data);
        layersControl = L.control.layers(baseMaps, overlayMaps);
        layersControl.addTo(map);
    });
}

createLayers(basemap);