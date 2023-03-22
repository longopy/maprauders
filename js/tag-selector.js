import $ from "jquery";

$("#tag-selector-btn").on("click", function () {
  $("#tag-selector").toggle();
});

$(function () {
  $(".tag-btn").on("click", function () {
    const children = $(this).parent().parent().parent().parent().find("tbody").find("tr").children().children()
    if ($(this).hasClass("tag-btn-selected")) {
        $(this).removeClass("tag-btn-selected").addClass("tag-btn-unselected");
        /*Change class of rows of tbody */
        children.removeClass("tag-btn-selected").addClass("tag-child-btn-unselected");
    }else if ($(this).hasClass("tag-btn-unselected")) {
        $(this).removeClass("tag-btn-unselected").addClass("tag-btn-selected");
        /*Change class of childrens*/
        children.removeClass("tag-child-btn-unselected").addClass("tag-btn-selected");
    }
  });
  $(".tag-child-btn").on("click", function () {
    const siblings = $(this).parent().parent().parent().find("tr").children().children()
    const parent = $(this).parent().parent().parent().parent().parent().find("thead").find("tr").children().children()
     if ($(this).hasClass("tag-btn-selected")) {
        $(this).removeClass("tag-btn-selected").addClass("tag-child-btn-unselected");
        if (siblings.hasClass("tag-child-btn-unselected")) {
            parent.removeClass("tag-btn-selected").addClass("tag-btn-unselected");
        }
     }
    else if ($(this).hasClass("tag-child-btn-unselected")) {
        $(this).removeClass("tag-child-btn-unselected").addClass("tag-btn-selected");
        if (siblings.hasClass("tag-btn-selected")) {
            parent.removeClass("tag-btn-unselected").addClass("tag-btn-selected");
        }
    }
  });
});
