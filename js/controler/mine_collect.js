;
(function ($) {
    window.onload = function () {
        var myscroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        var height = $(".mine_collect_main").height() - $(".mcm_tab").height()
        $("#wrapper").height(height)
        /*tab切换*/
        $(".mcm_tab>div").eq(0).find("span").addClass("onclick");
        $(".mcm_tab>div").click(function () {
            var idx = $(this).index();
            $(this).find("span").addClass("onclick");
            $(this).siblings().find("span").removeClass("onclick");
            $("#scroll").html("<img  class='beforeSend' src='../img/gif.gif'>");
            if (idx == 0) {
                /*产品ajax接口*/
                product();
            } else if (idx == 1) {
                /*咨询ajax接口*/
                $.ajax({
                    type: "get",
                    url: api_sudaizhijia_host + "/v1/favourite/newslists",
                    dataType: "json",
                    data: {
                        "pageNum": 100,
                        "pageSize": 1
                    },
                    success: function (json) {
                        if (json.code == 200 && json.error_code == 0) {
                            var html = "";
                            $.each(json.data.list, function (i, b) {
                                html += '<div class="activity_list" data-id=' + b.id + ' data-url=' + b.footer_img_h5 + '>' + '<a>' + '<div>' + '<h3>' + b.title + '</h3>' + '<p>' + b.create_time + '</p>' + '</div>' + '<div><img src=' + b.cover_img + '></div>' + '</a>' + '</div>'
                            })
                            $("#scroll").html(html);
                            myscroll.refresh();
                            $(".shou").addClass("shouOn")
                        } else if (json.error_code == 1500 || json.error_code == 500) {
                            var htmls = "<div class='noshou'>" + "<img src='../img/%E6%9A%82%E6%97%A0%E6%B6%88%E6%81%AF.png' alt=''>" + "<p>您暂时还没有收藏</p>" + "</div>";
                            $("#scroll").html(htmls);
                        }
                        bindProductDetail();
                    }
                })
            }
            myscroll.refresh();
        })
        /*判断星星显示颜色*/
        function starColor() {
            $(".product_xing>b").css({
                "display": "none"
            })
            $.each($(".product_xing"), function (a, b) {
                if ($(this).find("b").text() == 0) {
                    $(this).find("i").eq(idx).css({
                        "background": "url('../img/%E6%98%9F2.png')",
                        "background-size": "100% 100%"
                    });
                } else {
                    var reg = /^[0-9]*[1-9][0-9]*$/;
                    if (!reg.test(Number($(this).find("b").text()))) {
                        var zIdx = Math.floor($(this).find("b").text());
                        $(this).find("i").eq(zIdx).prevAll("i").css({
                            "background": "url('../img/%E6%98%9F1.png')",
                            "background-size": "100% 100%"
                        });
                        $(this).find("i").eq(zIdx).css({
                            "background": "url('../img/%E5%8D%8A%E6%98%9F.png')",
                            "background-size": "100% 100%"
                        });
                    } else {
                        var idx = Number($(this).find("b").text()) - 1;
                        $(this).find("i").eq(idx).prevAll("i").css({
                            "background": "url('../img/%E6%98%9F1.png')",
                            "background-size": "100% 100%"
                        });
                        $(this).find("i").eq(idx).css({
                            "background": "url('../img/%E6%98%9F1.png')",
                            "background-size": "100% 100%"
                        });
                    }
                }
            })
        }
        /*默认产品ajax接口*/
        function product() {
            $("#scroll").html("<img  class='beforeSend' src='../img/gif.gif'>");
            $.ajax({
                type: "get",
                url: api_sudaizhijia_host + "/v1/favourite/collectionlists",
                dataType: "json",
                data: {
                    "productType": 1,
                    "pageNum": 100,
                    "pageSize": 1
                },
                success: function (json) {
                    if (json.code == 200 && json.error_code == 0) {
                        var html = "";
                        $.each(json.data.list, function (i, b) {
                            html += "<div class='produc_touch_results' data-type=" + b.platform_product_id + ">" + "<dl class='res_top'>" + "<dt><img src=" + b.product_logo + "></dt>" + "<dd>" + " <h3>" + b.platform_product_name + "<a><b>" + b.to_use + "</b></a></h3>" + " <span class='product_xing'><b>" + b.star + "</b><i></i>" + " <i></i>" + " <i></i>" + " <i></i>" + "<i></i>" + "<em>" + b.success_count + "人已申请</em></span>" + " <p class='p1'>";
                            $.each(b.tag_name, function (x, y) {
                                html += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
                            });
                            html += "</p>" + "</dd>" + "</dl>" + "<div class='res_btm'>" + "<div>" + b.product_introduct + "</div>" + "<p></p>" + " </div>" + "</div>";
                        })
                        $("#scroll").html(html);
                        starColor();
                        myscroll.refresh();
                    } else if (json.error_code == 1500 || json.error_code == 500) {
                        var htmls = "<div class='noshou'>" + "<img src='../img/%E6%9A%82%E6%97%A0%E6%B6%88%E6%81%AF.png' alt=''>" + "<p>您暂时还没有收藏</p>" + "</div>";
                        $("#scroll").html(htmls);
                    }
                    bindProductDetail();
                }
            })
        }
        product()

        function bindProductDetail() {
            /*产品详情*/
            $(".produc_touch_results").off('click').on("click", function () {
                var chanpinid = $(this).data('type')
                window.location.href = "/html/product_result.html?productId=" + chanpinid;
            })
            /*咨询详情*/
            $(".activity_list").off('click').on("click", function () {
                if ($(this).data("url") != "") {
                    window.location.href = $(this).data("url")
                } else {
                    var newsid = $(this).data('id');
                    window.location.href = "/html/consult_details.html?titleType=13&newsId=" + newsid
                }
            })
        };
    }
})(jQuery);
