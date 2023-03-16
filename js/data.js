const icons = import.meta.glob("../data/icons/*.svg", { as: "raw" });

export default class Data {
  constructor() {
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
  getAttributionsByLang(attributions) {
    return attributions[this.lang];
  }
  getPoints(pointsData) {
    return this.getFeaturesByLang(pointsData);
  }
}
