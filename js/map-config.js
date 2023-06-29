// Styles
import "../css/back.css";
import "../css/map.css";
import "../css/modal-img.css";
import "../dist/ol/ol.css";

// elm-pep
import "elm-pep";

// Bootstrap
import { Popover } from "bootstrap";

// Modal Image
import ModalImg from "./modal-img.js";

// OpenLayers
import Feature from "ol/Feature.js";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import View from "ol/View.js";
import { getCenter } from "ol/extent.js";
import Point from "ol/geom/Point.js";
import { Vector as VectorLayer, Layer } from "ol/layer.js";
import VectorSource from "ol/source/Vector.js";
import { Icon, Style, Fill, Stroke, Text } from "ol/style.js";
import { defaults as interactionDefaults } from "ol/interaction.js";
import { composeCssTransform, rotate } from "ol/transform.js";
import { transform } from "ol/proj";

export default class MapConfig {
  constructor(mapInfo, rootPath, mapPoints, mapLabels) {
    this.config = mapInfo;
    this.rootPath = rootPath;
    this.points = mapPoints;
    this.labels = mapLabels;
    this.mapImgSrc = mapInfo["mapImgSrc"];
    this.padding = mapInfo["padding"];
    this.zoom = mapInfo["zoom"];
    this.minZoom = mapInfo["minZoom"];
    this.maxZoom = mapInfo["maxZoom"];
    this.resolution = mapInfo["resolution"];
    this.extent = [0, 0];
    this.extent = this.extent.concat(this.resolution); // Pixels
    this.projection = "EPSG:4326";
    this.loadMap();
    this.currentPoints = this.addPoints();
    this.addLabels();
    this.checkEvents();
  }
  loadMap() {
    this.map = new Map({
      renderer: "webgl",
      layers: this.loadLayers(),
      pixelRatio: 1,
      target: document.getElementById("map"),
      view: new View({
        projection: this.projection,
        center: getCenter(this.extent),
        extent: [-180, -90, 180, 90],
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      }),
      interactions: interactionDefaults({ doubleClickZoom: false }),
    });
    this.loadPopups();
  }
  getIconStyle(iconName) {
    const path = `../data/icons/points/${iconName}`;
    return new Style({
      image: this.createIcon(path, 32.2, 45.5),
      zIndex: 1,
    });
  }
  getIconStyleOnHover(iconName) {
    const path = `../data/icons/points/${iconName}`;
    return new Style({
      image: this.createIcon(path, 46, 65),
      zIndex: 2,
    });
  }
  createPoint(point) {
    const iconFeature = new Feature({
      geometry: new Point(point["position"]),
      imgSrc: point["imgSrc"] || undefined,
      iconName: point["iconName"],
      name: point["name"],
      description: point["description"],
      category: point["category"],
      tag: point["tag"],
      type: "point",
    });
    const iconStyle = this.getIconStyle(point["iconName"]);
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  }
  createIcon(src, width, height) {
    return new Icon({
      anchor: [0.5, 45.5],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: src,
      width: width,
      height: height,
    });
  }
  addPoints() {
    const points = this.points;
    this.points = [];
    points.forEach((point) => {
      this.points.push(this.createPoint(point));
    });
    this.addFeatures(this.points);
    return this.points;
  }
  getLabelStyle(label) {
    return new Style({
      text: new Text({
        font: `small-caps ${label["size"]}px Montserrat, sans-serif`,
        fill: new Fill({
          color: label["fillColor"],
        }),
        stroke: new Stroke({
          color: label["outlineColor"],
          width: label["outlineWidth"],
        }),
        rotation: label["rotation"] * (Math.PI / 180),
      }),
    });
  }
  createLabel(label) {
    const labelFeature = new Feature({
      geometry: new Point(label["position"]),
      name: label["name"],
      type: "label",
    });
    const labelStyle = this.getLabelStyle(label);
    labelFeature.setStyle(labelStyle);
    labelFeature.getStyle().getText().setText(label["name"]);
    return labelFeature;
  }
  addLabels() {
    const labels = this.labels;
    this.labels = [];
    labels.forEach((label) => {
      this.labels.push(this.createLabel(label));
    });
    this.addFeatures(this.labels);
    return this.labels;
  }
  addFeatures(features) {
    features.forEach((feature) => {
      this.vectorSource.addFeature(feature);
    });
  }
  removeFeatures(features) {
    features.forEach((feature) => {
      this.vectorSource.removeFeature(feature);
    });
  }
  loadVectorLayer() {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    return this.vectorLayer;
  }
  loadImageMap(svgContainer) {
    fetch(`${this.rootPath}/${this.mapImgSrc}`)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((svg) => svg.documentElement)
      .then((svg) => {
        svgContainer.ownerDocument.importNode(svg);
        svgContainer.appendChild(svg);
      });
  }
  loadImageMapLayer() {
    const svgContainer = document.createElement("div");
    this.loadImageMap(svgContainer);
    const width = this.resolution[0];
    const height = this.resolution[1];
    const svgResolution = 360 / width;
    svgContainer.style.padding = this.padding;
    svgContainer.style.width = width + "px";
    svgContainer.style.height = height + "px";
    svgContainer.style.transformOrigin = "top left";
    svgContainer.className = "svg-layer";
    this.imageMapLayer = new Layer({
      render: function (frameState) {
        const scale = svgResolution / frameState.viewState.resolution;
        const center = frameState.viewState.center;
        const size = frameState.size;
        const cssTransform = composeCssTransform(
          size[0] / 2,
          size[1] / 2,
          scale,
          scale,
          frameState.viewState.rotation,
          -center[0] / svgResolution - width / 2,
          center[1] / svgResolution - height / 2
        );
        svgContainer.style.transform = cssTransform;
        svgContainer.style.opacity = this.getOpacity();
        return svgContainer;
      },
    });
    return this.imageMapLayer;
  }
  loadLayers() {
    return [this.loadVectorLayer(), this.loadImageMapLayer()];
  }
  loadPopupNameOverlay() {
    this.popupName = new Overlay({
      element: document.getElementById("popup-name"),
      positioning: "bottom-center",
      offset: [20, -32.5],
      stopEvent: false,
    });
    this.map.addOverlay(this.popupName);
  }
  loadPopupInfoOverlay() {
    this.popupInfo = new Overlay({
      element: document.getElementById("popup-info"),
      positioning: "bottom-center",
      offset: [1, 0],
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
    document.getElementById("hud").style.display = "none";
  }
  enableInteractions() {
    this.map.getInteractions().forEach((i) => {
      i.setActive(true);
    });
    document.getElementsByClassName("ol-zoom")[0].style.display = "block";
    document.getElementById("hud").style.display = "block";
  }
  createPopupName(feature) {
    this.popupName.setPosition(feature.getGeometry().getCoordinates());
    const popupContainer = document.getElementById("popup-name");
    this.popoverName = new Popover(popupContainer, {
      container: "body",
      animation: false,
      html: true,
      placement: "right",
      content: `<p class="popup-name-text">${feature.get("name")}</p>`,
    });
    this.popoverName.show();
  }
  createPopupInfo(feature) {
    this.popupInfo.setPosition(feature.getGeometry().getCoordinates());
    const popupContainer = document.getElementById("popup-info");
    this.popoverInfo = new Popover(popupContainer, {
      container: "body",
      animation: true,
      placement: "bottom",
      html: true,
      content: this.generateInfoCard(feature),
    });
    this.popoverInfo.show();
  }
  generateInfoCard(feature) {
    const imgSrc = feature.get("imgSrc", undefined);
    const imgContainer = `<a id="modal-img-toggle" role="button">
    <img
      class="card-img-top img-fluid"
      src="${this.rootPath}images/${imgSrc}"
      height="210.933"
      width="375"
    />
    </a>`;
    return (
      `<div class="card popup-info-card">
    <div class="card-img-header">
    <div><a href="#" id="popover-info-close" class="close btn-close btn-close-white d-block" data-dismiss="alert"></a></div>` +
      (imgSrc != undefined ? imgContainer : "") +
      `</div>
    <div class="card-body">
      <h5 class="card-title fw-bold text-uppercase">${feature.get("name")}</h5>
      ${
        feature.get("description") != undefined
          ? `<p class="card-text">${feature.get("description")}</p>`
          : ""
      }
    </div>
  </div>`
    );
  }
  checkPopoverInfoClose(feature) {
    const popoverInfoClose = document.getElementById("popover-info-close");
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    popoverInfoClose.addEventListener("click", this.handlePopoverClick);
    this.modalImg = new ModalImg(
      `${this.rootPath}images/${feature.get("imgSrc")}`
    );
    this.modalImg.prepareModal();
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
  copy_coordinates_to_clipboard(coords) {
    if (localStorage.getItem("edit_mode") == "true")
      navigator.clipboard.writeText(coords);
  }
  handleMapClick(e) {
    this.copy_coordinates_to_clipboard(e.coordinate);
    const feature = this.map.forEachFeatureAtPixel(e.pixel, function (feature) {
      return feature;
    });
    this.disposePopover("Name");
    if (!feature) {
      this.disposePopover("Info");
      this.enableInteractions();
      return;
    }
    if (feature.values_["type"] != "point") {
      return;
    }
    this.copy_coordinates_to_clipboard(feature.getGeometry().getCoordinates());
    this.disposePopover("Info");
    this.createPopupInfo(feature);
    this.currentFeature = feature;
    this.currentFeature.disabled = true;
    this.checkPopoverInfoClose(feature);
  }
  handleMapPointerMove(e) {
    const pixel = this.map.getEventPixel(e.originalEvent);
    const hit = this.map.hasFeatureAtPixel(pixel);
    this.map.getTarget().style.cursor = hit ? "pointer" : "";
    const feature = this.map.forEachFeatureAtPixel(e.pixel, function (feature) {
      return feature;
    });
    this.disposePopover("Name");
    if (!feature) {
      this.returnIconStyleCurrentFeature();
      return;
    }
    if (feature.values_["type"] != "point") {
      this.map.getTarget().style.cursor = "";
      return;
    }
    if (feature != this.currentFeature) {
      this.returnIconStyleCurrentFeature();
    }
    this.currentFeature = feature;
    this.changeIconStyleCurrentFeature();
    const position = feature.getGeometry().getCoordinates();
    this.popupName.setPosition(position);
    this.createPopupName(feature);
  }
  changeIconStyleCurrentFeature() {
    if (this.currentFeature != undefined) {
      this.currentFeature.setStyle(
        this.getIconStyleOnHover(this.currentFeature.get("iconName"))
      );
    }
  }
  returnIconStyleCurrentFeature() {
    if (this.currentFeature != undefined) {
      this.currentFeature.setStyle(
        this.getIconStyle(this.currentFeature.get("iconName"))
      );
    }
  }
  handleMapMoveStart(e) {
    this.returnIconStyleCurrentFeature();
    this.disposePopover("Info");
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
  checkEscKey() {
    this.handleEscKey = this.handleEscKey.bind(this);
    document.addEventListener("keydown", this.handleEscKey);
  }
  handleEscKey(e) {
    if (e.key === "Escape") {
      if (this.modalImg.modal.is(":visible")) {
        this.modalImg.modal.hide();
      } else if (typeof this.popoverInfo !== "undefined") {
        this.disposePopover("Info");
        this.enableInteractions();
      }
    }
  }
  checkTagEvents() {
    this.handleTagClick = this.handleTagClick.bind(this);
    const tagBtns = document.querySelectorAll(".tag-btn");
    tagBtns.forEach((tagBtn) => {
      tagBtn.addEventListener("click", this.handleTagClick);
    });
    this.handleTagChildClick = this.handleTagChildClick.bind(this);
    const tagChildBtns = document.querySelectorAll(".tag-child-btn");
    tagChildBtns.forEach((tagBtn) => {
      tagBtn.addEventListener("click", this.handleTagChildClick);
    });
  }
  handleTagClick(e) {
    let target = e.target;
    if (e.target.className.includes("tag-img")) {
      target = e.target.parentElement;
    }
    const activate = target.className.includes("unselected");
    this.currentPoints = this.points.filter((point) => {
      return point.values_.category == target.value;
    });
    if (activate) {
      this.addFeatures(this.currentPoints);
    } else {
      this.removeFeatures(this.currentPoints);
    }
  }
  handleTagChildClick(e) {
    let target = e.target;
    if (e.target.className.includes("tag-child-img")) {
      target = e.target.parentElement;
    }
    const activate = target.className.includes("unselected");
    this.currentPoints = this.points.filter((point) => {
      return point.values_.tag == target.value;
    });
    if (activate) {
      this.addFeatures(this.currentPoints);
    } else {
      this.removeFeatures(this.currentPoints);
    }
  }
  checkEvents() {
    this.checkMapEvents();
    this.checkEscKey();
    this.checkTagEvents();
  }
}
