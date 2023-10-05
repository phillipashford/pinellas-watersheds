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

fetch("data/study-area-watersheds.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    d.local.watsersheds = data;
  });

  fetch("data/pinellas-study-dem.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    d.local.contours = data;
  });

// Create the map object
const map = new maplibregl.Map({
  container: "map",
  center: [-82.6422, 27.7650],
  zoom: 13.75,
  style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`,
});

// Add source data and layers after the map has loaded
map.on("load", function () {
  // Add source data
  map.addSource("watersheds", {
    type: "geojson",
    data: d.local.watsersheds,
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
        "fill-color": "#aaa",
        "fill-opacity": 0.8,
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
        "line-color": "pink",
        "line-width": 1,
      },
    });

});

