var credit_activation = {
    initView: function () {
        this.getBanner();
        this.getBankss();
        this.initEventView();
    },
    initEventView: function () {
        $('.content_list').on('click', 'dl', function () {
            var href = $(this).data('href');
            if (localStorage.userId) {
                window.location.href = href;
            } else {
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        });
    },
    //banner
    getBanner: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/banners',
            type: 'GET',
            data: {
                "typeNid": 'banner_activation'
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
    getBankss: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/active',
            type: 'GET'
        }, function (obj) {
            var html = '';
            $.each(obj, function (i, b) {
                html += '<dl data-id=' + b.id + ' data-href="' + b.active_link + '"><dt><img src=' + b.bank_logo + ' alt=""></dt><dd>' + b.bank_short_name + '</dd></dl>';
            });
            $('.content_list').html(html);
        });
    },
};
$(function () {
    credit_activation.initView();
})
