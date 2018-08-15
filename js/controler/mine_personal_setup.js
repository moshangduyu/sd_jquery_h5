(function ($) {
    /*极验*/
    var jiyanFunction = function (smsType) {
        $("#popup-captcha-mobile").html("")
        $("#mask, #popup-captcha-mobile").show();
        $("#mask").click(function () {
            $("#mask, #popup-captcha-mobile").hide();
        });
        /*生成12位随机数*/
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
                $.ajax({
                    url: api_sudaizhijia_host + "/v1/geetes/verification", // 进行二次验证
                    type: "get",
                    dataType: "json",
                    data: {
                        type: "mobile",
                        "unique": unique,
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode
                    },
                    success: function () {
                        /*发送验证码*/
                        if (smsType == 2) { //2.修改密码
                            $.ajax({
                                url: api_sudaizhijia_host + "/v1/sms/password",
                                type: "post",
                                dataType: "json",
                                data: {
                                    "mobile": localStorage.phone
                                },
                                success: function (json) {
                                    if (json.code == 200 && json.error_code == 0) {
                                        local.codeSign = json.data.sign;
                                        window.location.href = "/html/mine_changemima2.html"
                                    } else {
                                        alert(json.error_message)
                                    }
                                    $("#mask, #popup-captcha-mobile").hide();
                                }
                            })
                        } else if (smsType == 3) { //3.修改绑定手机号
                            $.ajax({
                                url: api_sudaizhijia_host + "/v1/sms/phone",
                                type: "post",
                                dataType: "json",
                                data: {
                                    "mobile": localStorage.phone
                                },
                                success: function (json) {
                                    if (json.code == 200 && json.error_code == 0) {
                                        local.codeSign = json.data.sign;
                                        window.location.href = "/html/mine_personal_phone2.html";
                                    } else {
                                        alert(json.error_message)
                                    }
                                    $("#mask, #popup-captcha-mobile").hide();
                                }
                            })
                        }
                    }
                });
            })
        };
        $.ajax({
            url: api_sudaizhijia_host + "/v1/geetes/captcha", // 加随机数防止缓存
            type: "get",
            dataType: "json",
            data: {
                "type": "mobile",
                "unique": unique
            },
            success: function (data) {
                initGeetest({
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success
                }, handlerPopupMobile);
            }
        });
    }
    /*关于我们跳转*/
    $(".aboutour").click(function () {
        window.location.href = "/html/mine_aboutourH5.html"
    })
    /*修改密码*/
    $(".changemima").click(function () {
        if (localStorage.userId) {
            jiyanFunction(2);
        } else {
            local.login_reffer = "/html/mine_personal_setup.html";
            local.backHref = document.referrer;
            window.location.href = "/html/login.html"
        }
    })
    /*修改绑定手机号*/
    $(".changephone").click(function () {
        if (localStorage.userId) {
            jiyanFunction(3);
        } else {
            local.login_reffer = "/html/mine_personal_setup.html";
            local.backHref = document.referrer;
            window.location.href = "/html/login.html"
        }
    })
    /*判断是否显示退出登录*/
    if (localStorage.userId) {
        $("#back").show().click(function () {
            if (confirm("是否要退出登录？")) {
                var default_clubUrl = localStorage.default_clubUrl;
                localStorage.clear();
                local.default_clubUrl = default_clubUrl;
                window.location.href = "/index.html";
            }
        })
    }
})(jQuery);
