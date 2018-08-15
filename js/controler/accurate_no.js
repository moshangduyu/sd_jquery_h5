var matchingDataController = {
    initView: function () {
        localFun.resizeFooter();
        this.doTimeShowView();
        this.doChangeBtnView();
    },

    //banner图
    initBannerView: function (b) {
        if (b.exact_img != "") {
            $(".accrrate_resultORno_main").append("<img src=" + b.exact_img + " class='bannerImg'>")
        }
    },
    //修改资料按钮
    doChangeBtnView: function () {
        $.LogonStatusEvent($(".change"), function () {
            window.location.href = "/html/accurate.html"
        })
    },
    //时间显示
    doTimeShowView: function () {
        $(".nianyue>span").click(function () {
            $(this).addClass("on").siblings().removeClass("on");
            if ($(this).hasClass("tian")) {
                $(".time").attr("placeholder", "7-40天")
            }
            if ($(this).hasClass("yue")) {
                $(".time").attr("placeholder", "1-36月")
            }
        });
    },
    //已登录获取初始信息
    doExactDataView: function (b) {
        $(".money").val(b.balance)
        if (b.balance_time <= 40) {
            $(".time").val(b.balance_time);
            $(".tian").addClass("on").siblings().removeClass("on")
        } else {
            $(".time").val(b.balance_time / 30)
            $(".yue").addClass("on").siblings().removeClass("on")
        }
        if (b.to_use == 1) {
            $("#radio1").attr("checked", true);
        } else if (b.to_use == 2) {
            $("#radio2").attr("checked", true);
        }
    },
    //已登录状态点击匹配按钮
    doLoggedInBtnView: function () {
        $("#begin").click(function () {
            var moneyVal = Number($(".money").val());
            var timeVal = Number($(".time").val());
            if (moneyVal < 500 || moneyVal > 100000) {
                $.popupCover({
                    content: '借款金额为500-100000元！'
                })
                return false;
            }
            if (!/^[0-9]*$/.test(moneyVal)) {
                $.popupCover({
                    content: '借款金额格式不正确！'
                })
                return false;
            }
            if (!/^[0-9]*$/.test(timeVal)) {
                $.popupCover({
                    content: '借款期限格式不正确！'
                })
                return false;
            }
            if ($(".tian").hasClass("on")) {
                if (timeVal < 7 || timeVal > 40) {
                    $.popupCover({
                        content: '天数为7-40天！'
                    })
                    return false;
                } else {
                    var timeValEnd = timeVal;
                    var showTime = timeVal + "天";
                }
            }
            if ($(".yue").hasClass("on")) {
                if (timeVal < 1 || timeVal > 36) {
                    $.popupCover({
                        content: '月份为1-36个月！'
                    })
                    return false;
                } else {
                    var timeValEnd = timeVal * 30;
                    var showTime = timeVal + "个月";
                }
            };
            //判断个人信息资料是否完整&&存储数据
            service.doAjaxRequest({
                url: '/v1/exact/completeness',
                type: 'GET',
                data: {
                    "loanMoney": $(".money").val(),
                    "loanTimes": timeValEnd,
                    "useType": $("input[type=radio]:checked").val()
                }
            }, function (json) {
                local.balance = moneyVal;
                local.balanceTime = timeValEnd;
                local.touse = $("input[type=radio]:checked").val();
                window.location.href = "/html/accurate_result.html"
            }, function (json) {
                if (json.error_code == 1502) {
                    window.location.href = "/html/accurate.html"
                }

            });
        })
    },
    //未登录状态点击匹配按钮
    doNotLoggedInBtnView: function () {
        $("#begin").click(function () {
            local.login_reffer = window.location.href;
            window.location.href = "/html/login.html"
        })
    }

};
(function ($) {
    matchingDataController.initView();

    if (localStorage.userId) {
        service.doAjaxRequest({
            url: '/v1/exact/data',
            type: 'GET'
        }, function (json) {
            matchingDataController.doExactDataView(json);
        });
        matchingDataController.doLoggedInBtnView();
    } else {
        matchingDataController.doNotLoggedInBtnView();
    };
    /*banner图*/
    service.doAjaxRequest({
        url: '/v1/exact/banner',
        type: 'GET'
    }, function (json) {
        matchingDataController.initBannerView(json);
    });

})(jQuery);
