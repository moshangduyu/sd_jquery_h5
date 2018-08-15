var credit_card_elected = {
    initView: function () {
        this.specialType = $.GetQueryString('type');
        this.pageSize = 1;
        this.loading = false;
        this.initShowView();
        this.getLists();
        this.scroll();
        this.initEventView();
    },
    initShowView: function () {
        var _this = this;
        //选中状态判断
        $('#' + _this.specialType).addClass('onClick');
    },
    initEventView: function () {
        var _this = this;
        //nav切换
        $('.nav').on('click', 'li', function () {
            $(this).addClass('onClick').siblings('li').removeClass('onClick');
            _this.specialType = $(this).attr('id');
            _this.pageSize = 1;
            _this.loading = false;
            _this.getLists();
        })
        //详情点击
        $('.main').on('click', '.list', function () {
            var href = $(this).data('href');
            if (localStorage.userId) {
                window.location.href = href;
            } else {
                local.fromLogin = 1;
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        });
    },
    //列表
    getLists: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/creditcard/specials',
            type: 'GET',
            data: {
                deviceId: '',
                specialType: _this.specialType,
                pageSize: _this.pageSize,
                pageNum: 10
            }
        }, function (obj) {
            var html = '';
            $.each(obj.list, function (i, b) {
                html += '<div class="list" data-href="' + b.card_h5_link + '">' +
                    '<dl class="res_top"><dt><img src=' + b.card_logo + '></dt>' +
                    '<dd>' +
                    '<h3>' + b.card_name + '</h3>' +
                    '<p class="p1">' + b.activity_content + '</p>' +
                    '<em class="rightIcon"></em>' +
                    '</dd>' +
                    '</dl>' +
                    '<div class="res_btm">' +
                    '<p><img src="../img/credit_card_elected_listIcon.png"><span>本月<b>' + b.total_apply_count + '</b>申请</span></p>' +
                    '</div>' +
                    '</div>';
            });
            if (obj.pageCount == 1) {
                $('#PullUp').html('已加载全部');
            };
            if (_this.loading) {
                $(".main").append(html);
            } else {
                $(".main").html(html);
            }
            _this.pageCode = obj.pageCount;
            _this.pageSize++;
        }, function () {
            $('.main').html("<div class='noshou'><img src='../img/no_products_icon.png' alt=''></div>");
            $('#PullUp').show().html('暂无产品');
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
    credit_card_elected.initView();
})
