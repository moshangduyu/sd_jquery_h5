var credit_givebacks = {
    initView: function () {
        this.getBanner();
        this.getlists();
        this.initEventView();
    },
    initEventView: function () {

    },
    //banner
    getBanner: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/banners',
            type: 'GET',
            data: {
                "typeNid": 'banner_giveup'
            }
        }, function (obj) {
            var html = "";
            $.each(obj, function (i, b) {
                html += "<div class='swiper-slide' data-href=" + b.img_url + "><img src=" + b.img_link + " alt=''></div>"
            })
            $(".banner").html(html);
            if ($('.swiper-slide').length > 1) {
                var mySwiper = new Swiper('#lunbo', {
                    direction: 'horizontal',
                    loop: true,
                    autoplay: 3000,
                    autoplayDisableOnInteraction: false
                });
            }
            localFun.setBannerJump();
        });
    },
    //银行
    getlists: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/product/givebacks',
            type: 'GET',
            data: {
                paybackType: 'creditcard_payback'
            }
        }, function (obj) {
            var html1 = '';
            var html2 = '';
            $.each(obj, function (i, b) {
                if (i == 0) {
                    html1 = '<a href="/html/product_result.html?productId=' + b.platform_product_id + '"><dl>' +
                        '<dt><img src=' + b.product_logo + ' alt=""><p><span>' + b.success_count + '</span>人已申请</p></dt>' +
                        '<dd>' +
                        '<h3>' + b.platform_product_name + '</h3>' +
                        '<p>' + b.product_introduct + '</p>' +
                        '<p> <span>平均额度：<b>' + b.avg_quota + '</b></span><span style="padding-left:.5rem">' + b.rate_des + '：<b>' + b.min_rate + '</b></span></p>' +
                        '<h6><img src="../img/credit_list_time_icon.png" alt="">平均<b>' + b.fast_time + '</b>小时放款</h6>' +
                        '</dd>' +
                        '</dl>' +
                        '<span></span></a>';
                    $('.content_list_one').html(html1);
                } else {
                    html2 += '<a href="/html/product_result.html?productId=' + b.platform_product_id + '"><li><dl>' +
                        '<dt><img src=' + b.product_logo + ' alt=""></dt>' +
                        '<dd>' +
                        '<h3>' + b.platform_product_name + '<span><b>' + b.success_count + '</b>人已申请</span></h3>' +
                        '<p>' + b.product_introduct + '</p>' +
                        '<p><span>' + b.rate_des + '：<b>' + b.min_rate + '</b></span><span style="padding-left:.5rem">平均额度：<b>' + b.avg_quota + '</b></span></p>' +
                        '<h6><img src="../img/credit_list_time_icon.png" alt="">平均<b>' + b.fast_time + '</b>小时放款</h6>' +
                        '</dd>' +
                        '</dl>' +
                        '<span></span></li></a>';
                }
                $('.content_lists').html(html2);
                $('#PullUp').show();
            });

        });
    },
};
$(function () {
    credit_givebacks.initView();
})
