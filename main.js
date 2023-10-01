// import the MapLibre library and our styles
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import key from "./scripts/key.env";
import maplibregl from "maplibre-gl";

//create the map object
const map = new maplibregl.Map({
  container: "map",
  center: [-90, 38],
  zoom: 4,
  style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${key}`,
});

