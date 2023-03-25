
// Data
import mapsInfo from "../../data/maps/maps.json";
import mapPointsData from "../../data/maps/spaceport/points.json";
import { AttributionsData, MapData } from "../data.js";
import MapConfig from "../map-config.js";

// Tag-Selector
import "../../js/tag-selector";

// Map
const mapInfo = mapsInfo.filter((map) => map.folder === "spaceport")[0];
const mapData = new MapData(mapInfo, mapPointsData);
const mapPoints = mapData.getPoints();
const mapImgSrc = mapData.getMapImgSrc();
const resolution = mapData.getResolution();
const mapConfig = new MapConfig(mapImgSrc, resolution, mapPoints, []);

// Attributions
import "../../js/attributions";
const attributionsData = new AttributionsData()