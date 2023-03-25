// Styles
import "../css/tags.css"

import tags from "../data/maps/tags.json";

function getLangFromLocalStorage(){
  return localStorage.getItem("lang", "en");
}

 class MapData {
  constructor(mapInfo, mapPoints) {
    this.mapInfo = mapInfo;
    this.tags = tags;
    this.rootPath = `../data/maps/${this.mapInfo["folder"]}/`;
    this.mapPoints = mapPoints;
    this.lang = getLangFromLocalStorage();
    this.loadTags();
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
    return this.rootPath + this.mapInfo["mapImgSrc"];
  }
  getResolution() {
    return this.mapInfo["resolution"];
  }
  getMapTags() {
    const tags = [];
    this.mapPoints.forEach((point) => {
      tags.push(point["tag"]);
    });
    return tags;
  }
  getTags() {
    const mapTags = this.getMapTags();
    this.tags.forEach((tag) => {
      tag["children"] = tag["children"].filter((child) => {
        return mapTags.includes(child["id"]);
      });
    });
    this.tags = this.tags.filter((tag) => {
      return tag["children"].length > 0;
    });
  }
  loadTags() {
    this.getTags();
    const tagSelector = document.getElementById("tag-selector");
    tagSelector.innerHTML = this.generateTagSelector();
  }
  generateTagSelector() {
    let selector = "";
    this.tags.forEach((tag) => {
      selector =
        selector +
        this.generateTagCard(
          tag,
          tag["children"].map((child) => child)
        );
    });
    return selector;
  }
  generateTagCard(tag, childrenTags) {
    let table = `<table class="table table-borderless my-4">
    <thead>
      <tr>
        <th scope="col"><button type="button" class="btn selected btn-sm w-100 text-start tag-btn" value="${
          tag["id"]
        }"><img class="me-2" src="../data/icons/tags/${
      tag["id"]
    }.svg" width="20">${tag["name"][this.lang]}</button></th>
      </tr>
    </thead>
    <tbody>`;
    const rows = childrenTags.map((child) => {
      return `<tr><td><button type="button" class="btn selected btn-sm w-100 text-start tag-child-btn" value="${
        child["id"]
      }"><img class="me-2" src="../data/icons/tags/${
        child["id"]
      }.svg" width="20">${child["name"][this.lang]}</button></td></tr>`;
    });
    table = table + rows.join("") + `</tbody></table>`;
    return table;
  }
}

class AttributionsData{
  constructor() {
    this.lang = getLangFromLocalStorage();
    this.loadAttributions();
  }
  loadAttributions() {
    const attributionsInfo = document.getElementById("attributions-info");
    fetch(`${this.lang}/attributions.html`)
    .then(response=>response.text())
    .then((html)=> {
      attributionsInfo.innerHTML = html;
    })
  }
}

class MenuData{
  constructor() {
    this.loadMenu();
  }
  loadMenu() {
  }
}



export {MapData, AttributionsData, MenuData}