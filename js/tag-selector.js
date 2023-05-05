import $ from "jquery";

// Styles
import "../css/tags.css";

$("#tag-selector-btn").on("click", function () {
  $("#tag-selector").toggle();
});

$(function () {
  $(".tag-btn").on("click", function () {
    const children = $(this).parent().parent().find(".tag-child-btn");
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected").addClass("unselected");
        children.removeClass("selected").addClass("unselected");
    }else if ($(this).hasClass("unselected")) {
        $(this).removeClass("unselected").addClass("selected");
        children.removeClass("unselected").addClass("selected");
    }
  });
  $(".tag-child-btn").on("click", function () {
    const siblings = $(this).parent().parent().find(".tag-child-btn")
    const parent = $(this).parent().parent().parent().find(".tag-btn");
     if ($(this).hasClass("selected")) {
        $(this).removeClass("selected").addClass("unselected");
        if (siblings.filter(".selected").length == 0) {
            parent.removeClass("selected").addClass("unselected");
        }
     }
    else if ($(this).hasClass("unselected")) {
        $(this).removeClass("unselected").addClass("selected");
        if (siblings.filter(".selected").length > 0) {
            parent.removeClass("unselected").addClass("selected");
        }
    }
  });
});
