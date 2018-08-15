/*判断星星显示颜色*/
$(".product_xing>b").css({
    "display": "none"
})

function smallXing() {
    $.each($(".product_xing"), function (a, b) {
        if ($(this).find("b").text() == 0) {
            $(this).find("i").eq(idx).css({
                "background": "url('../img/%E6%98%9F2.png')"
                , "background-size": "100% 100%"
            });
        }
        else {
            var reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(Number($(this).find("b").text()))) {
                var zIdx = Math.floor($(this).find("b").text());
                $(this).find("i").eq(zIdx).prevAll("i").css({
                    "background": "url('../img/%E6%98%9F1.png')"
                    , "background-size": "100% 100%"
                });
                $(this).find("i").eq(zIdx).css({
                    "background": "url('../img/%E5%8D%8A%E6%98%9F.png')"
                    , "background-size": "100% 100%"
                });
            }
            else {
                var idx = Number($(this).find("b").text()) - 1;
                $(this).find("i").eq(idx).prevAll("i").css({
                    "background": "url('../img/%E6%98%9F1.png')"
                    , "background-size": "100% 100%"
                });
                $(this).find("i").eq(idx).css({
                    "background": "url('../img/%E6%98%9F1.png')"
                    , "background-size": "100% 100%"
                });
            }
        }
    })
}
/*大星星*/
function bigXing() {
    $.each($(".product_daxing"), function (a, b) {
        if ($(this).find("b").text() == 0) {
            $(this).find("i").eq(idx).css({
                "background": "url('../img/%E6%98%9F-%E5%A4%A72.png')"
                , "background-size": "100% 100%"
            });
        }
        else {
            var reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(Number($(this).find("b").text()))) {
                var zIdx = Math.floor($(this).find("b").text());
                $(this).find("i").eq(zIdx).prevAll("i").css({
                    "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')"
                    , "background-size": "100% 100%"
                });
                $(this).find("i").eq(zIdx).css({
                    "background": "url('../img/%E6%98%9F-%E5%A4%A7.png')"
                    , "background-size": "100% 100%"
                });
            }
            else {
                var idx = Number($(this).find("b").text()) - 1;
                $(this).find("i").eq(idx).prevAll("i").css({
                    "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')"
                    , "background-size": "100% 100%"
                });
                $(this).find("i").eq(idx).css({
                    "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')"
                    , "background-size": "100% 100%"
                });
            }
        }
    })
}
/*文本域输入*/
$(".taxtarea").bind("input propertychange", function () {
    var leng = $(this).val().length;
    $(this).next("p").find("span").text(leng);
})