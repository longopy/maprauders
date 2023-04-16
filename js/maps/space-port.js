
// Data
import mapsInfo from "../../data/maps/maps.json";
import mapPointsData from "../../data/maps/space-port/points.json";
import mapLabelsData from "../../data/maps/space-port/labels.json";
import { AttributionsData, MapData } from "../data";
import MapConfig from "../map-config";

// Tag-Selector
import "../../js/tag-selector";
const mapId = "space-port"

// Map
const mapInfo = mapsInfo.filter((map) => map.id === mapId)[0];
const mapData = new MapData(mapInfo, mapPointsData, mapLabelsData);
const mapPoints = mapData.getPoints();
const mapLabels = mapData.getLabels();
const mapImgSrc = mapData.getMapImgSrc();
const resolution = mapData.getResolution();
const padding = mapData.getPadding();
const zoom = mapData.getZoom();
const minZoom = mapData.getMinZoom();
const maxZoom = mapData.getMaxZoom();
const mapConfig = new MapConfig(mapImgSrc, resolution, mapPoints, mapLabels, padding, zoom, minZoom, maxZoom);

// Attributions
import "../../js/attributions";
const attributionsData = new AttributionsData()