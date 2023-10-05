// Import the MapLibre library, turf modules, api key, and our styles
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import maplibregl from "maplibre-gl"
import { API_KEY } from './scripts/key';
const apiKey = API_KEY;
import area from '@turf/area';
import lineIntersect from '@turf/line-intersect';
import { lineString } from '@turf/helpers';

// Set global variables
// ##########################
let d = {
  i: 0,
  local: {},
}

// Build UI content
// ##########################
const content = document.querySelector("#content");
const openButton = document.querySelector("#openButton");
const offCanvas = document.querySelector("#offCanvas");
const overlay = document.querySelector("#overlay");
const closeButton = document.querySelector("#closeButton");
const precipitationSlider = document.querySelector("#precipitationSlider");
const sliderValueDisplay = document.querySelector("#sliderValue");

precipitationSlider.addEventListener("input", function() {
  sliderValueDisplay.innerText = precipitationSlider.value;
  const precipitationValue = parseFloat(precipitationSlider.value);
  calculateRunoff(precipitationValue);
  console.log(d.local.watersheds);
});


const openUI = () => {
  offCanvas.classList.remove("translate-x-[-100%]");
  overlay.classList.remove("opacity-0");
  offCanvas.classList.add(
    "translate-x-0",
    "transition-transform",
    "duration-300",
    "ease-in-out"
  );
  overlay.classList.add("opacity-100", "pointer-events-auto");
};

const closeUI = () => {
  offCanvas.classList.remove("translate-x-0");
  overlay.classList.remove("opacity-100", "pointer-events-auto");
  offCanvas.classList.add("translate-x-[-100%]");
  overlay.classList.add("opacity-0");
};

openButton.addEventListener("click", openUI);
overlay.addEventListener("click", closeUI);
closeButton.addEventListener("click", closeUI);


Promise.all([
  fetch("data/study-area-watersheds.geojson").then(response => response.json()),
  fetch("data/pinellas-study-dem.geojson").then(response => response.json())
])
.then(([watershedsData, contoursData]) => {
  d.local.watersheds = watershedsData;
  d.local.contours = contoursData;

// Create the map object
const map = new maplibregl.Map({
  container: "map",
  center: [-82.6422, 27.7650],
  zoom: 13.75,
  style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`,
});

// Add source data and layers after the map has loaded
map.on("load", function () {

  preprocessData();

  // Add source data
  map.addSource("watersheds", {
    type: "geojson",
    data: d.local.watersheds,
    generateId: true
  });

  map.addSource("pinellas-contours", {
    type: "geojson",
    data: d.local.contours,
  });

    // Add geojson polygon layers
  map.addLayer({
      id: "watersheds",
      type: "fill",
      source: "watersheds",
      paint: {
        "fill-color": "grey",
        "fill-opacity": 0.3,
        "fill-outline-color": "white",
      },
    });

    map.addLayer({
      id: "contours",
      type: "line",
      source: "pinellas-contours",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "green",
        "line-width": 0.5,
      },
    });
  
  map.on('click', 'watersheds', function (e) {
    const clickedFeatureIndex = e.features[0].id;
    console.log("clickedfeatureindex: ", clickedFeatureIndex);
    const correspondingFeature = d.local.watersheds.features[clickedFeatureIndex];
    const runoffValue = correspondingFeature.properties.runoff;
    const areaValue = (e.features[0].properties.area / 1e6).toFixed(2);
    
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<b>Watershed Area:</b> ${areaValue} sq km <br> <b>Average Runoff Flow Rate:</B> ${runoffValue} m^3/s`)
      .addTo(map);
  });

});

})
.catch(error => {
  console.error("Error fetching data:", error);
});

function preprocessData() {
  d.local.watersheds.features.forEach((watershed, index) => {
      watershed.id = index;
      // Calculate area using Turf.js
      const watershedArea = area(watershed);
      // Assign the computed area back to the watershed's properties
      watershed.properties.area = watershedArea;
      // Set initial value for runoff
      watershed.properties.runoff = 0;
      
  });
}

function calculateRunoff(precipitation) {
  const avgIntensity = precipitation / 24;

  d.local.watersheds.features.forEach(watershed => {
    const areaKm2 = watershed.properties.area / 1e6;
    const runoffCoefficient = 0.5;

    const runoffRate = (runoffCoefficient * avgIntensity * areaKm2).toFixed(0);
    watershed.properties.runoff = runoffRate;
  });
}

