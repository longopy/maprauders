// Data
import Data from "./data.js";
import mapPointsData from "../data/maps/spaceport/points.json"
import mapsInfo from "../data/maps/maps.json"

const mapInfo = mapsInfo.filter((map) => map.folder === "spaceport")[0];
const data = new Data(mapInfo, mapPointsData);
const mapPoints = data.getPoints();
const mapImgSrc = data.getMapImgSrc();
const resolution = data.getResolution();

// Map
import MapConfig from "./map-config.js";

new MapConfig(mapImgSrc, resolution, mapPoints, []);