// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
const extent = [0, 0, 1024, 968];
const projection = new ol.proj.Projection({
  code: "xkcd-image",
  units: "pixels",
  extent: extent,
});

const imageMapLayer = new ol.layer.Image({
  source: new ol.source.ImageStatic({
    attributions:
      'Made with ❤️ by <a href="https://twitch.tv/longopy">longopy</a>',
    url: "https://imgs.xkcd.com/comics/online_communities.png",
    projection: projection,
    imageExtent: extent,
  }),
});

const rasterLayer = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
    crossOrigin: "",
  }),
});

const iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([300, 300]),
  name: "Hidden Stash 1",
  tag: "hidden_stash",
});

const iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchorOrigin: "bottom-right",
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: "data/icons/default.png",
    width: 38,
    height: 38,
  }),
});

iconFeature.setStyle(iconStyle);

const vectorSource = new ol.source.Vector({
  features: [iconFeature],
});

const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
});

const map = new ol.Map({
  layers: [imageMapLayer, rasterLayer, vectorLayer],
  target: document.getElementById("map"),
  view: new ol.View({
    projection: projection,
    center: ol.extent.getCenter(extent),
    zoom: 1.5,
    minZoom: 1.5,
    maxZoom: 6,
  }),
});

const element = document.getElementById("popup");

const popup = new ol.Overlay({
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
map.on("click", function (e) {
  const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  console.log(feature.getGeometry().getCoordinates())
  const position = feature.getGeometry().getCoordinates();
  popup.setPosition(position);
  popover = new bootstrap.Popover(element, {
    animation: false,
    placement: "right",
    html: true,
    content: `<div class="card" style="width: 18rem;">
    <img class="card-img-top" src="https://cdn.akamai.steamstatic.com/steam/apps/1789480/ss_9abe13d99c6237b99b25fdcd622df36681240eab.1920x1080.jpg" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${feature.get("name")}</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>
  </div>`,
    //content: `Tag: ${feature.get("tag")}, Name: ${feature.get("name")}`,
  });
  popover.show();
});

// change mouse cursor when over marker
map.on("pointermove", function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? "pointer" : "";

  const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  const position = feature.getGeometry().getCoordinates();
  popup.setPosition(position);
  popover = new bootstrap.Popover(element, {
    animation: false,
    html: true,
    placement: "bottom",
    content: `<p class="popup-name">${feature.get("name")}</p>`,
  });
  popover.show();
});
// Close the popup when the map is moved
// map.on("movestart", disposePopover);
