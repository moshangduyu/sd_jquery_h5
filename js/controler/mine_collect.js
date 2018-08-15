var mineCollectController = {
    initView: function () {
        this.initShowView();
        this.doProductsListView();
        this.initEventView();
    },
    initShowView: function () {
        $("#wrapper").html("<img  class='beforeSend' src='../img/gif.gif'>");
    },
    initEventView: function () {
        var that = this;
        /*产品详情跳转*/
        $(document).on("click", '.produc_touch_results', function () {
            var chanpinid = $(this).data('type')
            window.location.href = "/html/product_result.html?productId=" + chanpinid;
        });
    },
    //默认收藏产品数据展示
    doProductsListView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v1/favourite/collectionlists',
            type: 'GET',
            data: {
                "productType": 1,
                "pageNum": 100,
                "pageSize": 1
            }
        }, function (obj) {
            var html = "";
            $.each(obj.list, function (i, b) {
                html += "<div class='produc_touch_results' data-type=" + b.platform_product_id + ">" + "<dl class='res_top'>" + "<dt><img src=" + b.product_logo + "></dt>" + "<dd>" + " <h3>" + b.platform_product_name + "<a><b>" + b.to_use + "</b></a></h3>" + " <span class='product_xing star'><b>" + b.star + "</b><i></i>" + " <i></i>" + " <i></i>" + " <i></i>" + "<i></i>" + "<em>" + b.success_count + "人已申请</em></span>" + " <p class='p1'>";
                $.each(b.tag_name, function (x, y) {
                    html += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
                });
                html += "</p>" + "</dd>" + "</dl>" + "<div class='res_btm'>" + "<div><b>" + b.product_introduct + "</b><span><img src='/img/list_time_icon.png'>" + b.fast_time + "</span></div>" + "</div></div>";
            })
            $("#wrapper").html(html);
            localFun.star();
        }, function (json) {
            if (json.error_code == 1500 || json.error_code == 500) {
                var htmls = "<div class='noshou'>" + "<img src='../img/no_products_icon.png' alt=''>" + "<p>暂无关注产品<br><a href='product.html'>立即去关注>></a></p>" + "</div>";
                $("#wrapper").html(htmls);
            }
        })
    }
};
$(function () {
    mineCollectController.initView();
});
