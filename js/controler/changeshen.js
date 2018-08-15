var changeshenController = {
    initView: function () {
        var that = this;
        that.nameZ = /^[A-Za-z0-9-_\u4e00-\u9fa5]{3,20}$/;
        localFun.resizeFooter();
        this.initShowView();
        this.initEventView();
    },
    initShowView: function () {
        //用户名和身份
        var INDENT = localStorage.indent;
        var USER_NAME = localStorage.username;
        var $shenfen = $(".changebanner>div");
        $(".name input").val(USER_NAME);
        switch (INDENT) {
            case '1':
                $shenfen.eq(1).prependTo($(".changebanner"))
                break;
            case '2':
                $shenfen.eq(0).prependTo($(".changebanner"))
                break;
            case '3':
                $shenfen.eq(2).prependTo($(".changebanner"))
                break;
            case '4':
                $shenfen.eq(3).prependTo($(".changebanner"))
                break;
        }
    },
    initEventView: function () {
        var that = this;

        //左右按钮切换
        $(".right").click(function () {
            $(".changebanner>div").eq(0).appendTo($(".changebanner"));
            that.doIndentSelectView();
        });
        $(".left").click(function () {
            $(".changebanner>div").eq(3).prependTo($(".changebanner"));
            that.doIndentSelectView();
        });

        //提交按钮点击
        $("footer").click(function () {
            that.doSubmitView();
        });

        /*修改密码按钮点击*/
        $(".changePassword").click(function () {
            that.doJiyanView();
        })
    },
    //左右按钮点击判断身份值indent
    doIndentSelectView: function () {
        var indentText = $(".changebanner>div").eq(0).find("p").text();
        switch (indentText) {
            case '学生党':
                indent = 1;
                break;
            case '上班族':
                indent = 2;
                break;
            case '生意人':
                indent = 3;
                break;
            case '自由职业':
                indent = 4;
                break;
        }
    },
    //提交check功能
    doSubmitView: function () {
        var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
        var $name = $(".name input"),
            emojireg = $name.val();
        emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
        $name.val(emojireg);
        if (emojireg == "") {
            $.popupCover({
                content: '亲，你的用户名叫什么?'
            })
            return false;
        } else {
            service.doAjaxRequest({
                url: '/v1/users/username',
                type: 'POST',
                data: {
                    "indent": indent,
                    "username": emojireg
                }
            }, function () {
                local.indent = indent;
                local.screenIdentIdx = indent;
                local.username = $name.val();
                $.popupCover({
                    content: '修改成功！',
                    callback: function () {
                        window.location.href = "/html/mine.html"
                    }
                })
            })
        }
    },
    //极验验证
    doJiyanView: function () {
        /*极验*/
        $("#popup-captcha-mobile").html("");
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
                    /*发送验证码*/
                    service.doAjaxRequest({
                        url: '/v1/sms/password',
                        type: 'POST',
                        data: {
                            "mobile": localStorage.phone
                        }
                    }, function (obj) {
                        local.codeSign = obj.sign;
                        window.location.href = "/html/mine_changemima2.html"
                    }, function (obj) {
                        $.popupCover({
                            content: obj.error_message
                        })
                    });
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

    }
};
$(function () {
    changeshenController.initView();
});
(function ($) {


})(jQuery);
