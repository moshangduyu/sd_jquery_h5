var forgetMaController = {
    initView: function () {
        localFun.resizeFooter();
        this.initShowView();
        this.initEventView();
        this.doCountDownView();
        this.geetesCaptcha();
    },
    initShowView: function () {
        var localPhone = localStorage.phone,
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
        })

        //btn点击
        $(".btn").click(function () {
            if ($("input").val().length == 4) {
                service.doAjaxRequest({
                    url: '/v1/users/password/code',
                    type: 'GET',
                    data: {
                        "mobile": localStorage.phone,
                        "code": $("input").val(),
                        "smsType": "forgetpwd",
                        "sign": localStorage.codeSign
                    }
                }, function () {
                    window.location.href = "forgetMi.html";
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
            }
        })
    },
    //获取验证码
    doForgetPasswordView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v1/sms/forgetPwd',
            type: 'POST',
            data: {
                "mobile": localStorage.phone
            }
        }, function (obj) {
            $(".input_ma span").html("重新发送（<b class='daojishi'>60</b>）").css({
                "color": "#999"
            });
            local.codeSign = obj.sign;
            that.doCountDownView();
        }, function (json) {
            $.popupCover({
                content: json.error_message
            })
        });
    },
    //倒计时
    doCountDownView: function () {
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
    },
    //极验验证bind模式
    geetesCaptcha: function () {
        var that = this;
        var handler = function (captchaObj) {
            captchaObj.onSuccess(function () {
                var validate = captchaObj.getValidate();
                if (!validate) {
                    $.popupCover({
                        content: '请完成验证'
                    });
                } else {
                    //极验二次验证
                    $.ajax({
                        url: that.geetestUrl_verification,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            client_type: 'h5',
                            uuid: that.uuid,
                            geetest_challenge: validate.geetest_challenge,
                            geetest_validate: validate.geetest_validate,
                            geetest_seccode: validate.geetest_seccode
                        },
                        beforeSend: function () {},
                        success: function (data) {
                            setTimeout(function () {
                                if (data.code == 200 && data.error_code == 0) {
                                    captchaObj.reset();
                                    that.doForgetPasswordView();
                                } else {
                                    $.popupCover({
                                        content: '验证失败请重试',
                                        callback: function () {
                                            captchaObj.reset();
                                        }
                                    })
                                }
                            }, 1500);
                        }
                    });
                }
            });
            //重发验证码 
            $(".input_ma span").click(function () {
                if ($(this).html() == "重新发送") {
                    $('.geetest_panel_loading,.geetest_panel_success,.geetest_panel_error').css({
                        height: '113px'
                    });
                    captchaObj.verify();
                }
            });
        };
        service.doAjaxRequest({ //获取uuid
            url: '/v2/geetest/uuid',
            type: 'GET',
            data: {
                'client_type': 'h5'
            }
        }, function (data) {
            var uuid = that.uuid = data.geetestUuid;
            var geetestUrl_captcha = data.geetestUrl_captcha;
            that.geetestUrl_verification = data.geetestUrl_verification;
            service.doAjaxRequest({ //验证uuid
                url: '/v2/geetest/uuid/verification',
                type: 'GET',
                data: {
                    'client_type': 'h5',
                    'uuid': uuid
                }
            }, function (data) {
                if (data.status == true) {
                    //极验一次验证
                    $.ajax({
                        url: geetestUrl_captcha,
                        type: 'GET',
                        dataType: 'json',
                        data: {},
                        beforeSend: function () {},
                        success: function (data) {
                            initGeetest({
                                gt: data.gt,
                                challenge: data.challenge,
                                offline: !data.success,
                                new_captcha: data.new_captcha,
                                product: 'bind'
                            }, handler);
                        }
                    });
                }
            }, function (data) {
                $.popupCover({
                    content: data.error_message
                })
            })
        }, function (data) {
            $.popupCover({
                content: data.error_message
            })
        })
    }
};
$(function () {
    forgetMaController.initView();
})
