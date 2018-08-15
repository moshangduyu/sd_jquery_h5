var messageController = {
    initView: function () {
        var myscroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        window.onload = function () {
            myscroll.refresh();
        };
        this.initCookieView();
    },
    initCookieView: function () {
        //设置凌晨0点到期
        $.cookie('message_notice', 'false', {
            expires: localFun.setCookieTime(),
            path: '/'
        });
    },
    doRequestView: function (json) {
        var html = "";
        $.each(json, function (i, b) {
            html += "<div class='today' data-id=" + b.id + ">" + "<h4>" + b.title + "</h4>";
            if (b.notice_sign == 1) {
                html += "<a href=" + b.url + "><div class='img'><img src=" + b.src + "></div></a>"
            }
            html += "<p>" + b.content + "</p>" + "<h3>" + b.create_time + "</h3>" + "</div>"
            $(".scroll").html(html);

        })
    }
};
$(function () {
    messageController.initView();
    /*通知接口*/
    service.doAjaxRequest({
        url: '/v1/notice/notices',
        type: 'GET'
    }, function (json) {
        messageController.doRequestView(json);
    }, function (json) {
        alert(json.error_message)
    });
});
