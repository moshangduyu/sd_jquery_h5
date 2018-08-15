var matchingResultController = {
    initView: function () {
        this.myscroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        //初始化页面显示加载动画
        $("#scroll").html("<img  class='beforeSend' src='/img/gif.gif'>");
    },
    //结果数据
    doResuleDataSuccessView: function (json) {
        $("#scroll").html('<h3 class="title" id="jingzhun" style="display:none">智能匹配</h3>' + '<div class="accurate"></div>' + '<h3 class="title" id="jiejin" style="display:none">接近匹配</h3>' + '<div class="standard"></div>');
        var html1 = "";
        var html2 = "";
        $.each(json.list, function (i, b) {
            if (b.unnecount == 0) {
                html1 += "<div class='produc_touch_results' data-type=" + b.platform_product_id + ">" + "<dl class='res_top'>" + "<dt><img src=" + b.product_logo + "></dt>" + "<dd>" + " <h3>" + b.platform_product_name + "</h3>" + " <span class='product_xing'><b>" + b.star + "</b><i></i>" + " <i></i>" + " <i></i>" + " <i></i>" + "<i></i>" + "<em>" + b.success_count + "人已申请</em></span>" + " <p class='p1'>";
                $.each(b.tag_name, function (x, y) {
                    html1 += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
                });
                html1 += "</p>" + "</dd>" + "<em class='rightIcon'>" + "</em>" + "</dl>" + "<div class='res_btm'>" + "<div>" + b.product_introduct + "</div>" + "<p></p>" + " </div>" + "</div>";
            } else {
                html2 += "<div class='produc_touch_results' data-type=" + b.platform_product_id + ">" + "<dl class='res_top'>" + "<dt><img src=" + b.product_logo + "></dt>" + "<dd>" + " <h3>" + b.platform_product_name + "</h3>" + " <span class='product_xing'><b>" + b.star + "</b><i></i>" + " <i></i>" + " <i></i>" + " <i></i>" + "<i></i>" + "<em>" + b.success_count + "人已申请</em></span>" + " <p class='p1'>";
                $.each(b.tag_name, function (x, y) {
                    html2 += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
                });
                html2 += "</p>" + "</dd>" + "<em class='rightIcon'>" + "</em>" + "</dl>" + "<div class='res_btm'>" + "<div>" + b.product_introduct + "</div>" + "<p></p>" + " </div>" + "</div>";
            }
        });
        $(".accurate").html(html1);
        $(".standard").html(html2);
        localFun.starSmall();
        if ($(".accurate").html() != "") {
            $("#jingzhun").show();
        }
        if ($(".standard").html() != "") {
            $("#jiejin").show();
        }
        this.myscroll.refresh();
        /*点击跳转产品详情*/
        $(".produc_touch_results").on("click", function () {
            var chanpinid = $(this).data('type')
            window.location.href = "/html/product_result.html?productId=" + chanpinid
        })
    },
    //错误处理
    doResuleDataErrorView: function (json) {
        if (json.error_code == 1500) {
            var html3 = "<div class='no_result'>" + "<img src='/img/%E5%8C%B9%E9%85%8D%E7%BB%93%E6%9E%9C%E6%97%A0%E6%95%B0%E6%8D%AE.png' alt=''>" + "<p>啊哦,没有与您匹配的产品</p>" + "<h3><a href='/html/accurte_no.html'>重新匹配</a></h3>" + "</div>"
            $("#scroll").html(html3)
        } else {
            $.popupCover({
                content: json.error_message
            });
        }
    }
};
(function ($) {
    matchingResultController.initView();
    service.doAjaxRequest({
        url: '/v1/exact/exacts',
        type: 'GET',
        data: {
            "loanMoney": localStorage.balance,
            "loanTimes": localStorage.balanceTime,
            "useType": localStorage.touse,
            "pageSize": 1,
            "pageNum": 100,
            "areaId": localStorage.cityId || '0'
        }
    }, function (json) {
        matchingResultController.doResuleDataSuccessView(json);
    }, function (json) {
        matchingResultController.doResuleDataErrorView(json);
    })

})(jQuery);
