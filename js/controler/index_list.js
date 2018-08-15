var specialListView = {
    initView: function () {
        /*截取地址栏信息*/
        var title = $.GetQueryString("title");
        var myscroll = this.myscroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        $('.title').text(title);
        /*底部下载弹窗*/
        localFun.downloadCover(0);
        //ajaxbefore
        $(".produc_touch_result").html("<img  class='beforeSend' src='../img/gif.gif'>");
        $("#wrapper").css({
            "position": "relative"
        });
    },
    doProductSpecialView: function (obj) {
        $("header>p").html(obj.title);
        $("title").html(obj.title);
        $(".produc_touch_result").html("<div class='banner'><img src=" + obj.img + "></div>");
        $(".produc_touch_result").append("<div id='produc_touch_result'></div>");
        var html = "";
        $.each(obj.list, function (i, b) {
            html += "<div class='produc_touch_results' data-type=" + b.platform_product_id + ">" + "<dl class='res_top'>" + "<dt><img src=" + b.product_logo + "></dt>" + "<dd>" + " <h3>" + b.platform_product_name + "<a><b>" + b.to_use + "</b></a></h3>" + " <h6>平均额度：<b>" + b.star + "</b> 元" + "<em style='color:#808080;float:right;padding-right:.3rem'>" + b.success_count + "人已申请</em></h6>" + " <p class='p1'>";
            $.each(b.tag_name, function (x, y) {
                html += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
            });
            html += "</p>" + "<em class='rightIcon'>" + "</em>" + "</dd>" + "</dl>" + "<div class='res_btm'>" + "<div>" + b.product_introduct + "</div>" + "<p></p>" + " </div>" + "</div>";
        })
        $("#produc_touch_result").html(html);
        specialListView.myscroll.refresh();
        $('.produc_touch_results:first>dl').css({
            "border": 0
        })
        $('.produc_touch_results:last').css({
            "padding-bottom": ".25rem"
        })
        //产品详情
        $(".produc_touch_results").off('click').on("click", function () {
            var chanpinid = $(this).data('type')
            window.location.href = "/html/product_result.html?productId=" + chanpinid
        });

    }
};
(function ($) {
    specialListView.initView();
    service.doAjaxRequest({
        url: '/v1/product/special',
        type: 'GET',
        data: {
            "specialId": $.GetQueryString("listId"),
            "pageSize": 1,
            "pageNum": 100,
            "productType": 7
        }
    }, function (json) {
        specialListView.doProductSpecialView(json)
    });
    window.onload = function () {
        specialListView.myscroll.refresh();
    };
})(jQuery);
