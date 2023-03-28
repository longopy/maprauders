
// Data
import mapsInfo from "../../data/maps/maps.json";
import mapPointsData from "../../data/maps/space-port/points.json";
import { AttributionsData, MapData } from "../data";
import MapConfig from "../map-config";

// Tag-Selector
import "../../js/tag-selector";
const mapId = "space-port"

// Map
const mapInfo = mapsInfo.filter((map) => map.id === mapId)[0];
const mapData = new MapData(mapInfo, mapPointsData);
const mapPoints = mapData.getPoints();
const mapImgSrc = mapData.getMapImgSrc();
const resolution = mapData.getResolution();
const zoom = mapData.getZoom();
const minZoom = mapData.getMinZoom();
const maxZoom = mapData.getMaxZoom();
const mapConfig = new MapConfig(mapImgSrc, resolution, mapPoints, [], zoom, minZoom, maxZoom);

// Attributions
import "../../js/attributions";
const attributionsData = new AttributionsData()