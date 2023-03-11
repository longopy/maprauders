import Feature from "ol/Feature.js";
import Overlay from "ol/Overlay.js";
import Point from "ol/geom/Point.js";
import TileJSON from "ol/source/TileJSON.js";
import VectorSource from "ol/source/Vector.js";
import { Icon, Style } from "ol/style.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import ImageLayer from "ol/layer/Image.js";
import Map from "ol/Map.js";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";
import View from "ol/View.js";
import { getCenter } from "ol/extent.js";

// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
const extent = [0, 0, 1024, 968];
const projection = new Projection({
  code: "xkcd-image",
  units: "pixels",
  extent: extent,
});

const imageMapLayer = new ImageLayer({
  source: new Static({
    url: "https://imgs.xkcd.com/comics/online_communities.png",
    projection: projection,
    imageExtent: extent,
  }),
});

const iconFeature = new Feature({
  geometry: new Point([300, 300]),
  name: "Null Island",
  population: 4000,
  rainfall: 500,
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: "data/icons/default.png",
    width: 30,
    height: 30
  }),
});


const vectorSource = new VectorSource({
  features: [iconFeature],
});


const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const rasterLayer = new TileLayer({
  source: new TileJSON({
    url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
    crossOrigin: "",
  }),
});

iconFeature.setStyle(iconStyle);

const map = new Map({
  layers: [imageMapLayer, rasterLayer, vectorLayer],
  target: document.getElementById("map"),
  view: new View({
    projection: projection,
    center: getCenter(extent),
    zoom: 2,
    maxZoom: 8,
  }),
});

const element = document.getElementById("popup")

const popup = new Overlay({
  element: element,
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
// display popup on click
map.on("click", function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  popup.setPosition(evt.coordinate);
  popover = new bootstrap.Popover(element, {
    container: element,
    animation: true,
    placement: "top",
    html: true,
    content: feature.get("name"),
  });
  popover.show();
});

// change mouse cursor when over marker
map.on("pointermove", function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? "pointer" : "";
});
// Close the popup when the map is moved
map.on("movestart", disposePopover);