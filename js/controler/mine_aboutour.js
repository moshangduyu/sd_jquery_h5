var from = $.GetQueryString('from');
if (from == 1) {
    $("#header").show();
    $('#wrapper').css({
        "margin-top": ".9rem"
    })
};

function hideBtn() {
    $('.btm').hide();
};
