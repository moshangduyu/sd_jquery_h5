var credit_have_gifts = {
    initView: function () {
        this.pageSize = 1;
        this.loading = false;
        this.getBanner();
        this.getBankss();
        this.scroll();
        this.initEventView();
    },
    initEventView: function () {
        $('.content_list').on('click', '.btn', function () {
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
                "typeNid": 'banner_gift'
            }
        }, function (obj) {
            var html = '';
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
    //列表
    getBankss: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/creditcard/gift',
            type: 'GET',
            data: {
                pageSize: _this.pageSize,
                pageNum: 10
            }
        }, function (obj) {
            var html = '';
            $.each(obj.list, function (i, b) {
                html += '<dl data-id=' + b.id + '><dt><img src=' + b.card_img + ' alt=""></dt><dd><h3>' + b.card_name + '</h3><p>' + b.activity_content + '</p><span class="btn" data-href="' + b.card_h5_link + '">立即申请</span></dd></dl>';
            });
            if (_this.loading) {
                $(".content_list").append(html);
            } else {
                $(".content_list").html(html);
            }
            if (obj.pageCount > 1) {
                $('#PullUp').show();
            }
            _this.pageCode = obj.pageCount;
            _this.pageSize++;
        });
    },
    scroll: function () {
        var _this = this;
        $(window).scroll(function () {　
            //判断滚动到底部
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_this.pageSize <= _this.pageCode) {
                    _this.loading = true;
                    setTimeout(function () {
                        _this.getLists();
                    }, 300)
                } else {
                    $('#PullUp').show().html('已加载全部');
                }
            }
        });
    }
};
$(function () {
    credit_have_gifts.initView();
})
