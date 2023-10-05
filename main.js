// import the MapLibre library and our styles
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import maplibregl from "maplibre-gl";
import { API_KEY } from './scripts/key';
const apiKey = API_KEY;

// Create the map object
const map = new maplibregl.Map({
  container: "map",
  center: [-82.6422, 27.7650],
  zoom: 13.75,
  style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`,
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

// Add source data and layers after the map has loaded
map.on("load", function () {
  // Add source data
  map.addSource("watersheds", {
    type: "geojson",
    data: "data/study-area-watersheds.geojson",
  });
  map.addSource("pinellas-contours", {
    type: "geojson",
    data: "data/pinellas-study-dem.geojson",
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
