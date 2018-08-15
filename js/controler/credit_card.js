var creditCard = {
    initView: function () {
        //        this.checkIsPrompt();
        this.getBanksHots();
        this.getPosterList();
        this.getSelectedBanners();
        this.getUsagesBanners();
        this.getMoreHotCard();
        this.initEventView();
    },
    initEventView: function () {
        //列表跳转
        //        $('').on('click', 'li', function () {
        //            var type = $(this).data('type');
        //
        //        });
        //热门推荐列表跳转
        $('.more_hot_card_list').on('click', 'li', function () {
            var href = $(this).data('href');
            if (localStorage.userId) {
                window.location.href = href;
            } else {
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        });
    },
    //定位提示
    checkIsPrompt: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/device/prompt',
            type: 'GET',
            data: {
                "deviceId": ''
            }
        }, function (obj) {
            _this.area_id = obj.area_id;
            _this.user_city = obj.user_city;
            if (obj.is_prompt == 1) {
                //提示
                if (confirm('请选择当前位置')) {
                    window.location.href = "/html/cityList.html"
                }
            }
            if (obj.is_user == 1) {
                //登录
            }
        })
    },
    //热门银行
    getBanksHots: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/hots',
            type: 'GET',
            data: {
                "deviceId": ''
            }
        }, function (obj) {
            var html = '';
            $.each(obj, function (i, b) {
                html += '<a href="/html/credit_card_list.html?cardListType=banks&bankName=' + b.bank_short_name + '&bankId=' + b.id + '"><dl><dt><img src=' + b.bank_logo + ' alt=""></dt><dd>' + b.bank_short_name + '</dd></dl></a>';
            });
            $('.hot_credit_list').html(html);
        });
    },
    //广告轮播效果
    poster: function (advertisement) {
        var liHeight = $(".carousel_ul li").height(); //一个li的高度
        var clickEndFlag = true; //设置每张走完才能再点击
        setInterval(function () {
            $(".carousel_ul").animate({
                top: -liHeight
            }, 800, function () {
                $(".carousel_ul li").eq(0).appendTo($(".carousel_ul"));
                $(".carousel_ul").css({
                    "top": 0
                });
            })
        }, 3000)
    },
    //广告轮播列表接口
    getPosterList: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/creditcard/headlines',
            type: 'GET'
        }, function (obj) {
            var html = '';
            $.each(obj, function (i, b) {
                html += ' <li>' + b.title + '<a href="/html/credit_' + b.headline_url + '.html"><span>' + b.name + '</span></a></li>';
            });
            $('.carousel_ul').html(html);
            _this.poster();
        });
    },
    //特色精选
    getSelectedBanners: function () {
        service.doAjaxRequest({
            url: '/v1/banks/banners/specials',
            type: 'GET'
        }, function (obj) {
            var html = '';
            $.each(obj, function (i, b) {
                if (i == 2) {
                    html += '<a href="/html/credit_have_gifts.html"><div data-id=' + b.id + '><img src=' + b.special_link + ' alt=""></div></a>';
                } else {
                    html += '<a href="/html/credit_card_elected.html?type=' + b.type_nid + '"><div data-id=' + b.id + '><img src=' + b.special_link + ' alt=""></div></a>';
                }

            });
            $('.Selected_credit_list').html(html);
        });
    },
    //用途卡片
    getUsagesBanners: function () {
        service.doAjaxRequest({
            url: '/v1/banks/banners/usages',
            type: 'GET'
        }, function (obj) {
            var html = '';
            $.each(obj, function (i, b) {
                html += '<div><a href="/html/credit_card_list.html?cardListType=usage&bankName=' + b.usage_name + '&bankId=' + b.usage_type_nid + '"><img src=' + b.img_link + ' alt=""></a></div>';
            });
            $('.Service_card_list').html(html);
        });
    },
    //热门推荐
    getMoreHotCard: function () {
        service.doAjaxRequest({
            url: '/v1/banks/creditcard/specials',
            type: 'GET',
            data: {
                deviceId: '',
                specialType: 'special_recommend',
                pageSize: 1,
                pageNum: 3
            }
        }, function (obj) {
            var html = '';
            $.each(obj.list, function (i, b) {
                html += '<li data-id=' + b.id + ' data-href="' + b.card_h5_link + '">' +
                    '<dl>' +
                    '<dt><img src=' + b.card_logo + ' alt=""></dt>' +
                    '<dd>' +
                    ' <h3>' + b.card_name + '</h3>' +
                    '<p>' + b.activity_content + '</p>' +
                    '<p><b>' + b.total_apply_count + '</b>本月申请</p>' +
                    '</dd>' +
                    '</dl>' +
                    '<span></span>' +
                    '</li>';
            });
            $('.more_hot_card_list').html(html);
        });
    }
};
$(function () {
    creditCard.initView();
});
