var feedbackController = {
    initView: function () {
        var that = this;
        /*判断是否是微信浏览器*/
        if (Terminal.platform.weChat) {
            that.terminal = "手机微信"
        } else {
            if (Terminal.platform.iPhone) {
                that.terminal = "IOS浏览器"
            } else {
                that.terminal = "安卓浏览器"
            }
        }
        this.initEventView();
    },
    initEventView: function () {
        var that = this;
        /*文本域输入*/
        $(".addcom_taxtarea").bind("input propertychange", function () {
            var leng = $(this).val().length;
            $(this).next("p").find("span").text(leng);
            if (!leng == 0) {
                $(".change_foot").addClass("onfoot");
            } else {
                $(".change_foot").removeClass("onfoot");
            }
        })
        $(".addcom_taxtarea").blur(function () {
            if ($(this).val() == "") {
                $(".change_foot").removeClass("onfoot");
            }
        });
        $(".change_foot").click(function () {
            if ($(this).hasClass("onfoot")) {
                var viewContent = $("textarea").val();
                service.doAjaxRequest({
                    url: '/v2/helps/feedback',
                    type: 'POST',
                    data: {
                        "feedback": viewContent,
                        "version": "无",
                        "browser": that.terminal,
                        "screenSize": "无",
                        "phoneModel": "无",
                        "programVersion": "H5-速贷之家2.8.1"
                    }
                }, function () {
                    $.popupCover({
                        content: '提交成功！',
                        callback: function () {
                            javascript: history.back(-1)
                        }
                    })
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                })
            }
        })
    }
};
$(function () {
    feedbackController.initView();
})
