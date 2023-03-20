export default class Data {
  constructor(mapInfo, mapPoints, attributions) {
    this.mapInfo = mapInfo;
    this.rootPath = `../data/maps/${this.mapInfo["folder"]}/`;
    this.mapPoints = mapPoints;
    this.attributions = attributions;
    this.lang = this.getLangFromLocalStorage();
  }
  getLangFromLocalStorage() {
    return localStorage.getItem("lang");
  }
  getFeaturesByLang(features) {
    features.forEach((feature) => {
      feature["name"] = feature["name"][this.lang];
    });
    return features;
  }
  getAttributionsByLang() {
    return this.attributions[this.lang];
  }
  getPoints() {
    return this.getFeaturesByLang(this.mapPoints);
  }
  getMapImgSrc() {
    return this.rootPath + this.mapInfo["mapImgSrc"]
  }
  getResolution() {
    return this.mapInfo["resolution"]
  }
}
