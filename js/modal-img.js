import $ from "jquery";

export default class ModalImg {
  constructor(imgUrl) {
    this.modal = $("#modal-img");
    this.imgUrl = imgUrl;
    if (this.imgUrl != undefined){
      this.updateModalImgSource();
      return this;
    }
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
    this.handleModalShow = this.handleModalShow.bind(this);
    const modalImgToggle = document.getElementById("modal-img-toggle");
    if (modalImgToggle != null)
    modalImgToggle.addEventListener("click", this.handleModalShow);
  }
  handleModalShow(e) {
    this.modal.show();
  }
  prepareModalImgToHide() {
    this.handleModalHide= this.handleModalHide.bind(this);
    const modalImgClose = document.getElementById("modal-img-close");
    modalImgClose.addEventListener("click", this.handleModalHide);
  }
  handleModalHide(e) {
    this.modal.hide();
  }
  
}
