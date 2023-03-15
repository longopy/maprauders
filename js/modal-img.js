import $ from "jquery";

export default class ModalImg {
  constructor(imgUrl) {
    this.imgUrl = imgUrl;
    this.updateModalImgSource();
    return this;
  }
  updateModalImgSource() {
    const modalImg = document.getElementById("modal-img-fs");
    modalImg.src = this.imgUrl;
  }
  prepareModal() {
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
