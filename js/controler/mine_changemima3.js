var changemima3Controller = {
    initView: function () {
        var that = this;
        that.passwordZ = /^[-_a-zA-Z0-9]{6,20}$/;
        localFun.resizeFooter();
        this.initEventView();
    },
    initEventView: function () {
        var that = this;
        //眼睛
        $(".pwd_yan").click(function () {
            if ($(this).hasClass("kan")) {
                $(this).removeClass("kan");
                $(this).parent("p").find("input")[0].type = 'password';
            } else {
                $(this).addClass("kan");
                $(this).parent("p").find("input")[0].type = 'text';
            }
        });
        //按钮颜色
        $("input").bind("input propertychange", function () {
            if (that.passwordZ.test($("#password").val())) {
                $(".btn").addClass("next_click")
            } else {
                $(".btn").removeClass("next_click")
            }
        });
        //btn点击
        $(".btn").click(function () {
            var pas = $.md5($("#password").val());
            if ($(".btn").hasClass("next_click")) {
                service.doAjaxRequest({
                    url: '/v1/users/password',
                    type: 'POST',
                    data: {
                        "password": pas,
                        "reset_token": true
                    }
                }, function () {
                    $.popupCover({
                        content: '修改成功！',
                        callback: function () {
                            localStorage.clear();
                            local.login_reffer = "mine_personal_setup.html";
                            window.location.href = "/html/login.html";
                        }
                    })
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
            }
        })
    }

};
$(function () {
    changemima3Controller.initView();
})
