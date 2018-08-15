;
(function ($) {
        /*解决安卓手机键盘弹出屏幕向上*/
    var H = $(window).height();
    $(window).resize(function () {
        var h = $(window).height();
        if (h < H) {
            $("footer").hide();
        } else {
            $("footer").show();
        }
    })
})(jQuery);