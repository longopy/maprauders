import $ from "jquery";

// Styles
import "../css/tags.css";

$("#tag-selector-btn").on("click", function () {
  $("#tag-selector").toggle();
});

$(function () {
  $(".tag-btn").on("click", function () {
    const children = $(this).parent().parent().parent().parent().find("tbody").find("tr").children().children()
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected").addClass("unselected");
        children.removeClass("selected").addClass("unselected");
    }else if ($(this).hasClass("unselected")) {
        $(this).removeClass("unselected").addClass("selected");
        children.removeClass("unselected").addClass("selected");
    }
  });
  $(".tag-child-btn").on("click", function () {
    const siblings = $(this).parent().parent().parent().find("tr").children()
    const parent = $(this).parent().parent().parent().parent().find("thead").find("tr").children().children()
     if ($(this).hasClass("selected")) {
        $(this).removeClass("selected").addClass("unselected");
        if (siblings.find(".selected").length == 0) {
            parent.removeClass("selected").addClass("unselected");
        }
     }
    else if ($(this).hasClass("unselected")) {
        $(this).removeClass("unselected").addClass("selected");
        if (siblings.find(".unselected").length == 0) {
            parent.removeClass("unselected").addClass("selected");
        }
    }
  });
});
