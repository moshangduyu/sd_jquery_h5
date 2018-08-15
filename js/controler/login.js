var loginController = {
    initView: function () {
        var that = this;
        that.jiyan = $.cookie('jiyan') || '';
        local.a = $.GetQueryString("a");
        localFun.resizeFooter();
        this.initShowView();
        this.initEventView();
        this.doLoginJiyanView();

        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
        local.sd_duiba_sign = GetQueryString("sd_duiba_sign") || '';
    },
    initShowView: function () {
        //默认显示
        $(".tab_one").show();
        //快捷登录按钮显示状态
        if (phonez.test($(".phone").val())) {
            $(".btn_one").addClass("next_click");
        };
    },
    initEventView: function () {
        var that = this;
        //返回按钮
        $('.login_back_btn').click(function () {
            //判断是否为社区跳转
            if (localStorage.login_reffer == 'forum.html') {
                window.location.href = "/html/forum.html";
            } //判断是否为修改密码跳转
            else if (localStorage.login_reffer == 'mine_personal_setup.html') {
                window.location.href = "/html/mine_personal_setup.html";
            } else {
                window.location.href = document.referrer;
            }
        });
        //tab点击切换
        $(".top_tab>a").click(function () {
            var ind = $(this).index();
            $(this).addClass("show").siblings("a").removeClass("show");
            $(".tabBox").eq(ind).show().siblings().hide();
        });
        //快捷登录-检测按钮颜色
        $(".phone").bind("input propertychange", function () {
            if (phonez.test($(".phone").val())) {
                $(".btn_one").addClass("next_click");
            } else {
                $(".btn_one").removeClass("next_click");
            }
        });
        //快捷登录-验证手机号并跳转
        $(".btn_one").on("click", function () {
            local.phone = $(".phone").val();
            if ($(this).hasClass("next_click")) {
                that.doSmsLoginView();
            }
        });
        //账号登录-X号按钮
        $(".phone_x").on("click", function () {
            $(this).prev("input").val("");
            $(this).hide();
        });
        //账号登录-眼睛
        $(".pwd_yan").on("click", function () {
            if ($(this).hasClass("kan")) {
                $(this).removeClass("kan");
                $(this).parent("p").find("input")[0].type = 'password';
            } else {
                $(this).addClass("kan");
                $(this).parent("p").find("input")[0].type = 'text';
            }
        });
        //账号登录-按钮颜色
        $(".input").bind("input propertychange", function () {
            var len = $(this).val().length;
            if (len > 0) {
                $(this).next('span').show();
            } else {
                $(this).next('span').hide();
            }
            if (phonez.test($("#phone_zhang").val()) && 6 <= $("#password").val().length && $("#password").val().length <= 20) {
                $(".btn_two").addClass("next_click")
            } else {
                $(".btn_two").removeClass("next_click")
            }
        }).focus(function () {
            var len = $(this).val().length;
            if (len > 0) {
                $(this).next('span').show();
            } else {
                $(this).next('span').hide();
            }
        });
    },
    //登录极验验证
    doLoginJiyanView: function () {
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
                                    that.doPasswordLoginView();
                                } else {
                                    $.popupCover({
                                        content: '登录失败，请完成验证',
                                        callback: function () {
                                            captchaObj.reset();
                                        }
                                    })
                                }
                            }, 1500);
                        }
                    });
                }
            })
            //btn点击
            $(".btn_two").click(function () {
                that.telTwo = $("#phone_zhang").val();
                that.pasTwo = $.md5($("#password").val());
                if ($(".btn_two").hasClass("next_click")) {
                    if (that.jiyan == "") {
                        that.doPasswordLoginView();
                    }
                    if (that.jiyan == "true") {
                        $('.geetest_panel_loading,.geetest_panel_success,.geetest_panel_error').css({
                            height: '113px'
                        });
                        captchaObj.verify();
                    }
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
    },
    //快捷登录脚本
    doSmsLoginView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v1/sms/register',
            type: 'POST',
            data: {
                "mobile": $(".phone").val()
            }
        }, function (json) {
            local.codesign = json.sign;
            window.location.href = "/html/loginQuick.html";
        }, function (json) {
            $.popupCover({
                content: json.error_message
            })
        })
    },
    //账号密码登录
    doPasswordLoginView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v1/auth/login',
            type: 'POST',
            data: {
                "mobile": that.telTwo,
                "password": that.pasTwo,
                "version": 3
            }
        }, function (obj) {
            cnzz_TrackEvent('wap', '用户登录', '账号密码登录', '');
            local.userId = obj.sd_user_id;
            local.indent = obj.indent;
            local.username = obj.user_name;
            local.phone = obj.mobile;
            local.token = obj.accessToken;
            local.user_photo = obj.user_photo;
            if (local.sd_duiba_sign != '') {
                that.duiba();
            } else {
                if (obj.is_identity == 1) {
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
                } else {
                    window.location.href = "mine_change_indent.html"
                }
            }
        }, function (json) {
            $.popupCover({
                content: json.error_message
            });
            $.cookie('jiyan', true, {
                expires: localFun.setCookieTime(),
                path: '/'
            });
            that.jiyan = $.cookie('jiyan') || '';
        })
    },
    //兑吧
    duiba: function () {
        var _this = this;
        service.getShop({
            "redirect": local.sd_duiba_sign
        }, function (obj) {
            localStorage.removeItem('sd_duiba_sign');
            window.location.href = obj.redirect_url
        }, function (json) {
            $.popupCover({
                content: json.error_message
            })
        });
    }
};
$(function () {
    loginController.initView();
});
