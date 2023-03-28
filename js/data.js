// Styles
import "../css/tags.css";

import tags from "../data/maps/tags.json";
import maps from "../data/maps/maps.json";

function getLangFromLocalStorage() {
  if (!localStorage.hasOwnProperty("lang")) return "en";
  else return localStorage.getItem("lang");
}

class MapData {
  constructor(mapInfo, mapPoints, mapLabels) {
    this.mapInfo = mapInfo;
    this.tags = tags;
    this.rootPath = `../data/maps/${this.mapInfo["id"]}/`;
    this.mapPoints = mapPoints;
    this.mapLabels = mapLabels;
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
  getLabels() {
    return this.getFeaturesByLang(this.mapLabels);
  }
  getMapImgSrc() {
    return this.rootPath + this.mapInfo["mapImgSrc"];
  }
  getResolution() {
    return this.mapInfo["resolution"];
  }
  getZoom() {
    return this.mapInfo["zoom"];
  }
  getMinZoom() {
    return this.mapInfo["minZoom"];
  }
  getMaxZoom() {
    return this.mapInfo["maxZoom"];
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
    const tagSelector = document.getElementById("tag-selector-content");
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
    let table = `<div class="col-6"><table class="table table-borderless my-4">
    <thead>
      <tr>
        <th scope="col"><button type="button" class="btn selected btn-sm w-100 text-start tag-btn" value="${
          tag["id"]
        }"><img class="me-2" src="../data/icons/tags/${
      tag["iconName"]
    }" width="25">${tag["name"][this.lang]}</button></th>
      </tr>
    </thead>
    <tbody>`;
    const rows = childrenTags.map((child) => {
      return `<tr><td><button type="button" class="btn selected btn-sm w-100 text-start tag-child-btn" value="${
        child["id"]
      }"><img class="me-2" src="../data/icons/tags/${
        child["iconName"]
      }" width="25">${child["name"][this.lang]}</button></td></tr>`;
    });
    table = table + rows.join("") + `</tbody></table></div>`;
    return table;
  }
}

class AttributionsData {
  constructor() {
    this.lang = getLangFromLocalStorage();
    this.loadAttributions();
  }
  loadAttributions() {
    const attributionsInfo = document.getElementById("attributions-info");
    fetch(`../${this.lang}/attributions.html`)
      .then((response) => response.text())
      .then((html) => {
        attributionsInfo.innerHTML = html;
      });
  }
}

class MenuData {
  constructor() {
    this.lang = getLangFromLocalStorage();
    this.loadMenu();
  }
  loadMenu() {
    const menuContainer = document.getElementById("menu-div");
    let html = "";
    maps.forEach((map) => {
      html += `<div class="col p-3">
      <button class="btn p-0 rounded" onclick="window.location.href='./maps/${
        map["id"]
      }.html'">
        <div class="card" style="width: 18rem;">
          <img class="card-img-top" src="./data/maps/${map["id"]}/${
        map["cardImgSrc"]
      }" alt="${map["name"][this.lang]}">
          <div class="card-body">
            <h5 class="card-title fw-bold">${map["name"][this.lang]}</h5>
            <p class="card-text">${map["description"][this.lang]}</p>
          </div>
        </div>
      </button>
    </div>`;
    });
    menuContainer.innerHTML = html;
  }
}

export { MapData, AttributionsData, MenuData };
