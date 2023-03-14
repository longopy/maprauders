// Styles
import "./dist/bootstrap/bootstrap.min.css";
import "./dist/ol/ol.css";
import "./css/modal-img.css";
import "./css/main.css";

// elm-pep
import "elm-pep";

// Bootstrap
import * as bootstrap from 'bootstrap'

// Modal Image
import ModalImg from "./js/modal-img.js";

// Data
import defaultIconUrl from "./data/icons/default.svg";

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

function loadLayers() {
  const imageMapLayer = new ImageLayer({
    source: new Static({
      attributions:
        'Made with ❤️ by <a href="https://twitch.tv/longopy" target="_blank">longopy</a>',
      url: "https://imgs.xkcd.com/comics/online_communities.png",
      projection: projection,
      imageExtent: extent,
    }),
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
  return [imageMapLayer, vectorLayer, rasterLayer];
}

const iconFeature = new Feature({
  geometry: new Point([300, 300]),
  name: "Hidden Stash Stairs",
  tags: ["loot", "hidden_stash"],
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorOrigin: "bottom-right",
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: defaultIconUrl,
    width: 38,
    height: 38,
  }),
});

const vectorSource = new VectorSource({
  features: [iconFeature],
});

iconFeature.setStyle(iconStyle);

const map = new Map({
  layers: loadLayers(),
  target: document.getElementById("map"),
  view: new View({
    projection: projection,
    center: getCenter(extent),
    zoom: 1.75,
    minZoom: 1.75,
    maxZoom: 4,
  }),
});

const popupName = new Overlay({
  element: document.getElementById("popup-name"),
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popupName);

const popupInfo = new Overlay({
  element: document.getElementById("popup-info"),
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popupInfo);

let popoverName;
function disposePopoverName() {
  if (popoverName) {
    popoverName.dispose();
    popoverName = undefined;
  }
}

let popoverInfo;
function disposePopoverInfo() {
  if (popoverInfo) {
    popoverInfo.dispose();
    popoverInfo = undefined;
  }
}

function disableInteractions() {
  map.getInteractions().forEach((i) => {
    i.setActive(false);
  });
  document.getElementsByClassName("ol-zoom")[0].style.display = "none";
}

function enableInteractions() {
  map.getInteractions().forEach((i) => {
    i.setActive(true);
  });
  document.getElementsByClassName("ol-zoom")[0].style.display = "block";
}
// display popup on click
map.on("click", function (e) {
  const imgUrl =
    "https://cdn.akamai.steamstatic.com/steam/apps/1789480/ss_9abe13d99c6237b99b25fdcd622df36681240eab.1920x1080.jpg";
  const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });
  disposePopoverName();
  if (!feature) {
    disposePopoverInfo();
    enableInteractions();
    return;
  }
  const position = feature.getGeometry().getCoordinates();
  popupInfo.setPosition(position);
  const popupContainer = document.getElementById("popup-info");
  popoverInfo = new bootstrap.Popover(popupContainer, {
    container: "body",
    trigger: "manual",
    animation: true,
    placement: "top",
    html: true,
    content: `<div class="card">
    <div class="card-img-header">
    <div><a href="#" id="popover-info-close" class="close btn-close btn-close-white d-block" data-dismiss="alert"></a></div>
    <a id="modal-img-toggle" role="button">
    <img
      class="card-img-top img-fluid w-100"
      src="${imgUrl}"
      alt="Card image cap"
    />
    </a>
    </div>
    <div class="card-body">
      <h5 class="card-title">${feature.get("name")}</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up
        the bulk of the card's content.
      </p>
    </div>
  </div>`,
  });

  popoverInfo.show();
  disableInteractions();
  const popoverInfoClose = document.getElementById("popover-info-close");
  popoverInfoClose.onclick = function () {
    popoverInfo.hide();
    enableInteractions();
  };
  const modalImg = new ModalImg(imgUrl);
  modalImg.loadModal();
});
// change mouse cursor when over marker
map.on("pointermove", function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? "pointer" : "";
  const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });
  disposePopoverName();
  if (!feature) {
    return;
  }
  const position = feature.getGeometry().getCoordinates();
  popupName.setPosition(position);
  const popupContainer = document.getElementById("popup-name");
  popoverName = new bootstrap.Popover(popupContainer, {
    container: "body",
    animation: false,
    html: true,
    placement: "bottom",
    content: `<p class="popup-name-text">${feature.get("name")}</p>`,
  });
  popoverName.show();
});
// Close the popup when the map is moved
map.on("movestart", disposePopoverName);

