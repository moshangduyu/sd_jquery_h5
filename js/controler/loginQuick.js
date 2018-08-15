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
        var localPhone = this.localPhone,
            startLocalPhone = localPhone.substring(0, 3),
            endLocalPhone = localPhone.substring(7, 11),
            localPhone = startLocalPhone + '****' + endLocalPhone;
        $(".yfs b").text(localPhone);
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
                service.doAjaxRequest({
                    url: '/v2/auth/quicklogin',
                    type: 'POST',
                    data: {
                        "mobile": that.localPhone,
                        "code": $("input").val(),
                        "version": "3",
                        "sign": localStorage.codesign,
                        "channel_fr": cookie.getPlatFrom(),
                        "sd_invite_code": "",
                        "uid": ""
                    }
                }, function (obj) {
                    local.userId = obj.sd_user_id;
                    local.indent = obj.indent;
                    local.username = obj.user_name;
                    local.phone = obj.mobile;
                    local.token = obj.accessToken;
                    local.user_photo = obj.user_photo;
                    if (obj.activated == 0) {
                        window.location.href = "/html/loginMi.html";
                    } else {
                        if (obj.is_identity == 0) {
                            window.location.href = "mine_change_indent.html"
                        } else {
                            cnzz_TrackEvent('wap', '用户登录', '手机验证码登录', '');
                            if (localStorage.login_reffer) {
                                var reffer = localStorage.login_reffer;
                                localStorage.removeItem('login_reffer');
                                if (reffer.indexOf('?') >= 0) {
                                    window.location.href = reffer + '&fromLogin=1';
                                } else {
                                    window.location.href = reffer + '?fromLogin=1';
                                }
                            } else {
                                window.location.href = "/index.html"
                            }
                        }

                    }
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
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
                    url: '/v1/sms/register',
                    type: 'POST',
                    data: {
                        "mobile": that.localPhone
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
