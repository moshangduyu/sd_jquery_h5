var loginQuickController = {
    initView: function () {
        var that = this;
        that.localPhone = localStorage.phone;
        localFun.resizeFooter();
        this.initShowView();
        this.initCountDownView();
        this.initEventView();

    },
    initShowView: function () {
        var that = this;
        $(".yfs b").text(localStorage.newPhone);
        if ($("input").val().length == 4) {
            $(".btn").addClass("next_click")
        }
    },
    initEventView: function () {
        var that = this;
        //按钮颜色
        $("input").bind("input propertychange", function () {
            if ($("input").val().length == 4) {
                $(".btn").addClass("next_click");
            } else {
                $(".btn").removeClass("next_click")
            }
        });
        //btn点击
        $(".btn").click(function () {
            if ($("input").val().length == 4) {
                $.popupCover({
                    content: '暂不支持该功能，敬请谅解！'
                })
            } else {
                $.popupCover({
                    content: '请输入正确4位验证码'
                })
            }
        })
        //重发验证码
        $(".input_ma span").click(function () {
            if ($(this).html() == "重新发送") {
                service.doAjaxRequest({
                    url: '/v1/sms/updatePhone',
                    type: 'POST',
                    data: {
                        "mobile": localStorage.newPhone
                    }
                }, function (json) {
                    local.codesign = json.sign;
                    $.popupCover({
                        content: '发送短信成功！'
                    });
                    $(".input_ma span").html("重新发送（<b class='daojishi'>60</b>）").css({
                        "color": "#999"
                    });
                    that.initCountDownView();
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                })
            }
        })
    },
    //倒计时
    initCountDownView: function () {
        var time = 60;
        var t = setInterval(function () {
            time--;
            $(".daojishi").html(time);
            if (time == 0) {
                clearInterval(t);
                $(".input_ma span").html("重新发送").css({
                    color: "#44b7f7"
                });
            }
        }, 1000)
    }
};
$(function () {
    loginQuickController.initView();
})
