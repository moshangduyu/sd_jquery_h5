var forgetPhoneController = {
    initView: function () {
        localFun.resizeFooter();
        this.initShowView();
        this.initEventView();
        this.geetesCaptcha();
    },
    initShowView: function () {
        if (phonez.test($(".phone").val())) {
            $(".btn").addClass("next_click");
        }
    },
    initEventView: function () {
        //按钮颜色
        $("input").bind("input propertychange", function () {
            if (phonez.test($(".phone").val())) {
                $(".btn").addClass("next_click");
            } else {
                $(".btn").removeClass("next_click")
            }
        });
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
                                    service.doAjaxRequest({
                                        url: '/v1/sms/forgetPwd',
                                        type: 'POST',
                                        data: {
                                            "mobile": that.tel
                                        }
                                    }, function (obj) {
                                        local.codeSign = obj.sign;
                                        window.location.href = "forgetMa.html"
                                    }, function (json) {
                                        $.popupCover({
                                            content: json.error_message
                                        })
                                    })
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
            //验证手机号并跳转
            $(".btn").click(function () {
                that.tel = $(".phone").val();
                local.phone = that.tel;
                if (phonez.test(that.tel)) {
                    $('.geetest_panel_loading,.geetest_panel_success,.geetest_panel_error').css({
                        height: '113px'
                    });
                    captchaObj.verify();
                }
            })
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
    forgetPhoneController.initView();
})
