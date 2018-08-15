var loginController = {
    initView: function () {
        var that = this;
        that.jiyan = $.cookie('jiyan') || '';
        local.a = $.GetQueryString("a");
        localFun.resizeFooter();
        this.initShowView();
        this.initEventView();
    },
    initShowView: function () {
        //默认显示
        $(".tab_one").show();
        $(".top_tab>a").eq(0).addClass("show");
        //快捷登录按钮显示状态
        if (phonez.test($(".phone").val())) {
            $(".btn_one").addClass("next_click");
        };
    },
    initEventView: function () {
        var that = this;
        //返回按钮
        $('.login_back_btn').click(function () {
            //判断是否为论坛跳转
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
        //btn点击
        $(".btn_two").on("click", function () {
            that.telTwo = $("#phone_zhang").val();
            that.pasTwo = $.md5($("#password").val());
            if ($(".btn_two").hasClass("next_click")) {
                if (that.jiyan == "") {
                    that.doPasswordLoginView();
                }
                if (that.jiyan == "true") {
                    that.doJiyanView(1);
                }
            }
        })
        /*忘记密码*/
        $(".forget").click(function () {
            that.doJiyanView(2);
        })
    },
    //极验验证
    doJiyanView: function (state) {
        var that = this;
        $("#popup-captcha-mobile").html("");
        $("#mask, #popup-captcha-mobile").show(function () {
            $("#mask").click(function () {
                $("#mask, #popup-captcha-mobile").hide();
            });
        });
        //生成12位随机数
        var arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'l', 'k', 'j', 'h', 'g', 'f', 'd', 's', 'a', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'L', 'K', 'J', 'H', 'G', 'F', 'D', 'S', 'A', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
            len = arr.length,
            i = 0,
            string = [];
        for (; i < 12; i++) {
            string.push(arr[Math.floor(0 + Math.random() * (len - 0))]);
        }
        var unique = string.join('');
        var handlerPopupMobile = function (captchaObj) {
            captchaObj.appendTo("#popup-captcha-mobile");
            captchaObj.onSuccess(function () {
                var validate = captchaObj.getValidate();
                //极验二次验证
                service.doAjaxRequest({
                    url: '/v1/geetes/verification',
                    type: 'GET',
                    data: {
                        type: "mobile",
                        "unique": unique,
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode
                    }
                }, function (obj) {
                    $("#mask, #popup-captcha-mobile").hide();
                    if (state == 1) {
                        that.doPasswordLoginView();
                    } else if (state == 2) {
                        window.location.href = "/html/forgetPhone.html"
                    }
                })
            })
        };
        //极验一次验证
        service.geetesCaptcha({
            "type": "mobile",
            "unique": unique
        }, function (data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success
            }, handlerPopupMobile);
        });
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
            local.sign = json.sign;
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
            local.username = obj.username;
            local.phone = obj.mobile;
            local.sex = obj.sex;
            local.name = obj.realname;
            local.token = obj.accessToken;
            if (localStorage.login_reffer) {
                var reffer = localStorage.login_reffer;
                localStorage.removeItem('login_reffer');
                if (localStorage.fromLogin) {
                    localStorage.removeItem('fromLogin');
                    window.location.href = reffer + '&fromLogin=1';
                } else {
                    window.location.href = reffer + '?fromLogin=1';
                }
            } else {
                window.location.href = "/index.html"
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
};
$(function () {
    loginController.initView();
});
