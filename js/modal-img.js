
// jQuery
import $ from "jquery";

export default class ModalImg {
  constructor(imgUrl) {
    this.imgUrl = imgUrl;
    this.updateModalImgSource(imgUrl);
    return this;
  }
  updateModalImgSource(imgUrl) {
    const modalImg = document.getElementById("modal-img-fs");
    modalImg.src = imgUrl;
  }
  loadModal() {
    this.prepareModalImgToShow();
    this.prepareModalImgToHide();
  }
  prepareModalImgToShow() {
    const modalImgToggle = document.getElementById("modal-img-toggle");
    modalImgToggle.onclick = function () {
      $("#modal-img").show();
    };
  }
  prepareModalImgToHide() {
    const modalImgClose = document.getElementById("modal-img-close");
    modalImgClose.onclick = function () {
      $("#modal-img").hide();
    };
  }
}
