// Data
import Data from "./data.js";
import mapPointsData from "../data/maps/spaceport/points.json"
import {attributions} from "../data/info.json"
import mapsInfo from "../data/maps/maps.json"

const mapInfo = mapsInfo.filter((map) => map.folder === "spaceport")[0];
const data = new Data(mapInfo, mapPointsData, attributions);
const mapPoints = data.getPoints();
const attributionsText = data.getAttributionsByLang();
const mapImgSrc = data.getMapImgSrc();
const resolution = data.getResolution();

// Map
import MapConfig from "./map-config.js";

new MapConfig(mapImgSrc, resolution, mapPoints, [], attributionsText);