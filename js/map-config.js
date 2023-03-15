// Bootstrap
import * as bootstrap from "bootstrap";

// Modal Image
import ModalImg from "./modal-img.js";

// Data
import defaultIconUrl from "../data/icons/default.svg";

// OpenLayers
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

export default class MapConfig {
  constructor() {
    this.extent = [0, 0, 1024, 968]; // Pixels
    this.projection = new Projection({
      code: "xkcd-image",
      units: "pixels",
      extent: this.extent,
    });
    this.loadMap();
    this.checkMapEvents();
  }
  loadMap() {
    this.addFeatures();
    this.map = new Map({
      layers: this.loadLayers(),
      target: document.getElementById("map"),
      view: new View({
        projection: this.projection,
        center: getCenter(this.extent),
        zoom: 1.75,
        minZoom: 1.75,
        maxZoom: 4,
      }),
    });
    this.loadPopups();
  }
  createPoint() {
    const iconFeature = new Feature({
      geometry: new Point([487.6332462267761, 502.8370584449619]),
      imgSrc:
        "https://cdn.akamai.steamstatic.com/steam/apps/1789480/ss_9abe13d99c6237b99b25fdcd622df36681240eab.1920x1080.jpg",
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
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  }
  addFeatures() {
    const feature = this.createPoint();
    this.features = [feature];
  }
  loadVectorLayer() {
    const vectorSource = new VectorSource({
      features: this.features,
    });
    this.vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    return this.vectorLayer;
  }
  loadImageMapLayer() {
    this.imageMapLayer = new ImageLayer({
      source: new Static({
        attributions:
          'Made with ❤️ by <a href="https://twitch.tv/longopy" target="_blank">longopy</a>',
        url: "https://imgs.xkcd.com/comics/online_communities.png",
        projection: this.projection,
        imageExtent: this.extent,
      }),
    });
    return this.imageMapLayer;
  }
  loadRasterLayer() {
    this.rasterLayer = new TileLayer({
      source: new TileJSON({
        url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
        crossOrigin: "",
      }),
    });
    return this.rasterLayer;
  }
  loadLayers() {
    return [
      this.loadImageMapLayer(),
      this.loadVectorLayer(),
      this.loadRasterLayer(),
    ];
  }
  loadPopupNameOverlay() {
    this.popupName = new Overlay({
      element: document.getElementById("popup-name"),
      positioning: "bottom-center",
      stopEvent: false,
    });
    this.map.addOverlay(this.popupName);
  }
  loadPopupInfoOverlay() {
    this.popupInfo = new Overlay({
      element: document.getElementById("popup-info"),
      positioning: "bottom-center",
      stopEvent: false,
    });
    this.map.addOverlay(this.popupInfo);
  }
  loadPopups() {
    this.loadPopupNameOverlay();
    this.loadPopupInfoOverlay();
  }
  disableInteractions() {
    this.map.getInteractions().forEach((i) => {
      i.setActive(false);
    });
    document.getElementsByClassName("ol-zoom")[0].style.display = "none";
  }
  enableInteractions() {
    this.map.getInteractions().forEach((i) => {
      i.setActive(true);
    });
    document.getElementsByClassName("ol-zoom")[0].style.display = "block";
  }
  createPopupName(feature) {
    this.popupName.setPosition(feature.getGeometry().getCoordinates());
    const popupContainer = document.getElementById("popup-name");
    this.popoverName = new bootstrap.Popover(popupContainer, {
      container: "body",
      animation: false,
      html: true,
      placement: "bottom",
      content: `<p class="popup-name-text">${feature.get("name")}</p>`,
    });
    this.popoverName.show();
  }
  createPopupInfo(feature) {
    this.popupInfo.setPosition(feature.getGeometry().getCoordinates());
    const popupContainer = document.getElementById("popup-info");
    this.popoverInfo = new bootstrap.Popover(popupContainer, {
      container: "body",
      animation: true,
      placement: "top",
      html: true,
      content: `<div class="card">
      <div class="card-img-header">
      <div><a href="#" id="popover-info-close" class="close btn-close btn-close-white d-block" data-dismiss="alert"></a></div>
      <a id="modal-img-toggle" role="button">
      <img
        class="card-img-top img-fluid w-100"
        src="${feature.get("imgSrc")}"
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
    this.popoverInfo.show();
  }
  checkPopoverInfoClose(feature) {
    const popoverInfoClose = document.getElementById("popover-info-close");
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    popoverInfoClose.addEventListener("click", this.handlePopoverClick);
    const modalImg = new ModalImg(feature.get("imgSrc"));
    modalImg.prepareModal();
  }
  handlePopoverClick(e) {
    this.popoverInfo.hide();
    this.enableInteractions();
  }
  disposePopover(type) {
    const popoverName =
      "popover" + type.charAt(0).toUpperCase() + type.slice(1);
    if (this[popoverName]) {
      this[popoverName].dispose();
      this[popoverName] = undefined;
    }
  }
  handleMapClick(e) {
    // Copy coordinates to clipboard
    navigator.clipboard.writeText(e.coordinate);
    const feature = this.map.forEachFeatureAtPixel(e.pixel, function (feature) {
      return feature;
    });
    this.disposePopover("Name");
    if (!feature) {
      this.disposePopover("Info");
      this.enableInteractions();
      return;
    }
    this.createPopupInfo(feature);
    this.disableInteractions();
    this.checkPopoverInfoClose(feature);
  }
  handleMapPointerMove(e) {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTarget().style.cursor = hit ? "pointer" : "";
      const feature = this.map.forEachFeatureAtPixel(
        e.pixel,
        function (feature) {
          return feature;
        }
      );
      this.disposePopover("Name");
      if (!feature) {
        return;
      }
      const position = feature.getGeometry().getCoordinates();
      this.popupName.setPosition(position);
      this.createPopupName(feature);
  }
  handleMapMoveStart(e) {
    this.disposePopover("Name");
  }
  checkMapEvents() {
    this.handleMapClick = this.handleMapClick.bind(this);
    this.map.addEventListener("click", this.handleMapClick);
    this.handleMapPointerMove = this.handleMapPointerMove.bind(this);
    this.map.addEventListener("pointermove", this.handleMapPointerMove);
    this.handleMapMoveStart = this.handleMapMoveStart.bind(this);
    this.map.addEventListener("movestart", this.handleMapMoveStart);  
  }
}
