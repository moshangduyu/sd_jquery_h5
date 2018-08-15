var loginMiController = {
    initView: function () {
        var that = this;
        that.passwordZ = /^[-_a-zA-Z0-9]{6,20}$/;
        localFun.resizeFooter();
        this.initEventView();
        XBack.init();
        XBack.listen(function () {
            alert("请设置密码！");
        });
    },
    initEventView: function () {
        var that = this;
        //眼睛
        $(".paw_yan").click(function () {
            if ($(this).hasClass("kan")) {
                $(this).removeClass("kan");
                $(this).prev("input").prop("type", "password")
            } else {
                $(this).addClass("kan");
                $(this).prev("input").prop("type", "text")
            }
        });
        //提交按钮颜色
        $("input").bind("input propertychange", function () {
            if (that.passwordZ.test($('#password').val())) {
                $("button").addClass("next_click")
            } else {
                $("button").removeClass("next_click")
            }
        });
        /*提交按钮点击*/
        $("button").click(function () {
            if ($(this).hasClass('next_click')) {
                service.doAjaxRequest({
                    url: '/v1/users/password',
                    type: 'POST',
                    data: {
                        "password": $.md5($('#password').val()),
                        "reset_token": ''
                    }
                }, function () {
                    cnzz_TrackEvent('wap', '新用户注册', '信息填写完整', '');
                    $('.cover_true').show();
                    that.initCoverView(function () {
                        window.location.href = "mine_change_indent.html";
                    });
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
            } else {
                $.popupCover({
                    content: '请输入长度为6~20位字母，数字或下划线的密码'
                })
            }
        })
    },
    initCoverView: function (callBack) {
        $(".cover").css({
            "display": "block"
        }).fadeIn(500).delay(2000).fadeOut(500, callBack);
    }
};
$(function () {
    loginMiController.initView();
});
