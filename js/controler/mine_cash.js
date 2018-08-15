var mineCashController = {
    initView: function () {
        var that = this;
        that.myscroll = new iScroll("wrapper", {
            vScrollbar: false,
            bounce: false
        });
        this.initShowView();
        this.doCoverImgView();
    },
    initShowView: function () {
        /*计算屏幕滑动的高度*/
        var H = $(window).height(),
            h = H - $("header").height();
        $("#wrapper").css({
            "height": h
        });
    },
    initEventView: function () {

    },
    //顶部无缝滚动
    doCarouselView: function () {
        /*计算ul总宽度*/
        var $li = $(".carousel>li"),
            liNum = $li.length,
            liW = $li.width() + 1,
            marginW = 20 * liNum,
            ulW = liNum * liW + marginW;
        $(".carousel").css({
            "width": ulW
        });

        function animate() {
            $(".carousel").animate({
                left: -$(".carousel").width() + $(".head_btm").width()
            }, 40000, 'linear', function () {
                $(".carousel").css({
                    "left": 0
                });
            })
        }
        if (ulW > $(".head_btm").width()) {
            animate()
            setInterval(function () {
                animate()
            }, 40000)
        }
    },
    //图片弹窗
    doCoverImgView: function () {
        /*如何获得现金奖励？*/
        $(".reward").click(function () {
            $(".rewardCover").show();
        })
        /*现金提现规则*/
        $(".rule").click(function () {
            $(".ruleCover").show();
        })
        /*关闭按钮*/
        $(".coverBtn").click(function () {
            $(this).parents(".coverImg").hide();
        })
        /*滑动图片*/
        var $centerImg = $(".rewardCover .coverCenter>div"),
            len = $centerImg.length;
        $centerImg.on("touchstart", function (e) {
            e.preventDefault();
            startX = e.originalEvent.changedTouches[0].pageX;
        });
        $centerImg.on("touchend", function (e) {
            e.preventDefault();
            moveEndX = e.originalEvent.changedTouches[0].pageX;
            X = moveEndX - startX;
            if (X < 0) {
                var idx = $(".showImg").index() + 1;
                if (idx >= len) {
                    return false;
                }
                $centerImg.eq(idx).addClass("showImg").siblings("div").removeClass("showImg");
            }
            if (X > 0) {
                var idx = $(".showImg").index() - 1;
                if (idx < 0) {
                    return false;
                }
                $centerImg.eq(idx).addClass("showImg").siblings("div").removeClass("showImg");
            }
        })
    },
    //用户账户接口
    doAccountShowView: function (b) {
        var that = this;
        var top_ul = "",
            hisList = "";
        //我的账户现金
        $(".money_num").text(b.user_account);
        //顶部广告轮播
        $.each(b.account_cash, function (x, y) {
            top_ul += '<li>手机号:<span>' + y.mobile + '</span> &nbsp;<em>提现<i>' + y.total + '</i>元</em></li>'
        })
        $(".carousel").html(top_ul);
        that.doCarouselView();
        //alipay
        $(".alipay").text(b.alipay);
        //弹出图片文案
        $(".coverCenter_message").text(b.extra_money)
        //现金历史记录
        $.each(b.account_log, function (x, y) {
            hisList += ' <li><h4>' + y.remark + '</h4><p>' + y.create_at + '</p><span class="moneyChange" data-color=' + y.color_sign + '><em>' + y.money + '</em>元</span></li>'
        })
        $(".hisList").html(hisList);
        that.myscroll.refresh();
        //颜色&&+-判断
        $.each($(".moneyChange"), function () {
            if ($(this).data("color") == 0) {
                $(this).css({
                    "color": "#F76C6C"
                });
            }
        });
        //我要提现 btn
        $(".withdrawals").click(function () {
            if (b.info_sign == 1) {
                window.location.href = "/html/mine_withdrawals.html";
            } else {
                if (confirm("需要您的基本信息，确保现金打到您的账号上")) {
                    window.location.href = "/html/accurate.html";
                }
            }
        })
    }
}
$(function () {
    mineCashController.initView();
    /*用户账户接口*/
    service.doAjaxRequest({
        url: '/v1/account',
        type: 'GET',
        data: {}
    }, function (b) {
        mineCashController.doAccountShowView(b);
    }, function (json) {
        $.popupCover({
            content: json.error_message
        })
    })
})
