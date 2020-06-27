// load more on work page

$(".workGrid .projectDiv").slice(0,3).show();
$("#loadBtn").on('click', function () {
    $(".workGrid  .projectDiv:hidden").slice(0,1);

    if ($(".workGrid  .projectDiv:hidden").length === 0){
        $("#loadBtn").fadeOut();
    }
}); 