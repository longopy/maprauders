
// Data
import mapsInfo from "../../data/maps/maps.json";
import mapPointsData from "../../data/maps/space-port/points.json";
import { AttributionsData, MapData } from "../data";
import MapConfig from "../map-config";

// Tag-Selector
import "../../js/tag-selector";

// Map
const mapInfo = mapsInfo.filter((map) => map.id === "space-port")[0];
const mapData = new MapData(mapInfo, mapPointsData);
const mapPoints = mapData.getPoints();
const mapImgSrc = mapData.getMapImgSrc();
const resolution = mapData.getResolution();
const mapConfig = new MapConfig(mapImgSrc, resolution, mapPoints, []);

// Attributions
import "../../js/attributions";
const attributionsData = new AttributionsData()