var strategyController = {
    initView: function () {
        var myScroll = this.myScroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        window.onload = function () {
            myScroll.refresh();
        }
    },
    doSenseView: function (json) {
        var html = "";
        $.each(json.list, function (i, b) {
            html += "<div class='swiper-slide' data-id=" + b.id + " data-link=" + b.footer_img_h5 + ">" + "<img src=" + b.cover_img + ">" + "</div>";
        })
        $(".swiper-wrapper").html(html);

        $(".swiper-slide").click(function () {
            if ($(this).data("link") != "") {
                window.location.href = $(this).data("link")
            } else {
                var newsId = $(this).data("id")
                window.location.href = "/html/consult_details.html?titleType=12&newsId=" + newsId
            }
        });
        /*touch图*/
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 2.5,
            paginationClickable: true,
            spaceBetween: 15
        });
    },
    doNewsGuideView: function (json) {
        var html = "";
        $.each(json.list, function (i, b) {
            html += "<dl data-link=" + b.news_link + " id=" + b.platform_product_id + "><dt><img src=" + b.product_logo + "></dt>" + "<dd>" + b.platform_product_name + "</dd></dl>"
        })
        $(".gldq").append(html);
        $(".gldq>dl").click(function () {
            if (localStorage.userId) {
                window.location.href = $(this).data("link");
            } else {
                local.login_reffer = window.location.href;
                local.backHref = document.referrer;
                window.location.href = "/html/login.html";
            }
        });
        if ($(".gldq dl").length <= 12) {
            $(".gldq dl").show();
        } else {
            $(".gldq_more").show();
            $(".gldq dl").eq(11).show();
            $(".gldq dl").eq(11).prevAll("dl").show();
            var show = false;
            $(".gldq_more").click(function () {
                if (show) {
                    $(".gldq dl").hide();
                    $(".gldq dl").eq(11).show();
                    $(".gldq dl").eq(11).prevAll("dl").show();
                    show = false;
                } else {
                    $(".gldq dl").show();
                    show = true;
                }
                strategyController.myScroll.refresh();
            })
        }
    },
    doNewActivityView: function (json) {
        var html = "";
        $.each(json.list, function (i, b) {
            html += "<dl class='strategy_list' data-id=" + b.id + " data-link=" + b.footer_img_h5 + ">" + "<dt><img src=" + b.cover_img + "></dt>" + "<dd>" + "<h3>" + b.title + "</h3>" + "<p>" + b.create_time + "</p>" + "</dd>" + "</dl>"
        })
        $(".strategy").append(html);

        $(".strategy>dl").click(function () {
            if ($(this).data("link") != "") {
                window.location.href = $(this).data("link")
            } else {
                var newsId = $(this).data("id")
                window.location.href = "/html/consult_details.html?titleType=12&newsId=" + newsId
            }
        })
    }
};
$(function () {
    /*速贷常识*/
    service.doAjaxRequest({
        url: '/v1/news/activity',
        type: 'GET',
        data: {
            "pageSize": 1,
            "pageNum": 100,
            "newsType": 15
        }
    }, function (json) {
        strategyController.doSenseView(json);
    })

    /*产品攻略大全*/
    service.doAjaxRequest({
        url: '/v1/news/guide',
        type: 'GET',
        data: {
            "pageSize": 1,
            "pageNum": 100
        }
    }, function (json) {
        strategyController.doNewsGuideView(json);
    })

    /*最新攻略*/
    service.doAjaxRequest({
        url: '/v1/news/activity',
        type: 'GET',
        data: {
            "pageSize": 1,
            "pageNum": 100,
            "newsType": 12
        }
    }, function (json) {
        strategyController.doNewActivityView(json);
    });
    $(window).load(function () {
        strategyController.initView();
    });
});
