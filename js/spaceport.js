// Data
import Data from "./data.js";
import mapPointsData from "../data/maps/spaceport/points.json"
import {attributions} from "../data/info.json"
const data = new Data()
const mapPoints = data.getFeaturesByLang(mapPointsData, []);
const attributionsText = data.getAttributionsByLang(attributions);

// Map
import MapConfig from "./map-config.js";

new MapConfig(mapPoints, [], attributionsText);