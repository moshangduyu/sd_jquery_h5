var hotIssues = {
    initView: function () {
        this.initEventView();
        this.ajaxList();
        this.callPhone();
    },
    //免费热线
    callPhone: function () {
        $.LogonStatusEvent($("#kefu"), function () {
            window.location.href = 'http://kefu.easemob.com/webim/im.html?tenantId=34128&to=kefuchannelimid_041115&appKey=1164170103115772%23kefuchannelapp34128&xmppServer=im-api.easemob.com&restServer=a1.easemob.com';
        })
    },
    initEventView: function () {
        var that = this;
        //标题点击显示内容
        $("#list").on("click", "li", function () {
            $(this).parents(".mhm_ul").siblings('ul').find("span").removeClass("onshang");
            $(this).parents(".mhm_ul").siblings('ul').find("p").hide();
            $(this).find("span").toggleClass("onshang");
            $(this).next("p").slideToggle(300);
        })
    },
    ajaxList: function () {
        service.doAjaxRequest({
            url: "/v1/help",
            type: "GET"
        }, function (obj) {
            var html = "";
            //            $.each(obj, function (i, b) {
            //                html += "<h3>" + b.type_name + "</h3>";
            $.each(obj[0].list, function (x, y) {
                html += "<ul class='mhm_ul'>" + " <li>" + y.title + "<span></span></li>" + "<p>" + y.content + "</p>" + "</ul>";
            })
            //            });
            $("#list").html(html)
        })
    }
}

$(function () {
    hotIssues.initView();
})
