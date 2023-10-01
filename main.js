// import the MapLibre library and our styles
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import maplibregl from "maplibre-gl";
import { API_KEY } from './key';
const apiKey = API_KEY;

// Create the map object
const map = new maplibregl.Map({
  container: "map",
  center: [-90, 38],
  zoom: 4,
  style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`,
});

// Add source data and layers after the map has loaded
map.on("load", function () {
  // Add source data
  map.addSource("counties", {
    type: "geojson",
    data: "data/us-counties-optimized.json",
  });
  map.addSource("states", {
    type: "geojson",
    data: "data/us-states-optimized.json",
  });

    // Add geojson polygon layers
    map.addLayer({
      id: "counties",
      type: "fill",
      source: "counties",
      paint: {
        "fill-color": "#aaa",
        "fill-opacity": 0.8,
      },
    });
  
    map.addLayer({
      id: "states",
      type: "line",
      source: "states",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": 0.4,
      },
    });

});
