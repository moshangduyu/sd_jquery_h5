var credit_raise_quota = {
    initView: function () {
        this.pageSize = 1;
        this.loading = false;
        this.getLists();
        this.scroll();
    },
    getLists: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/quotas',
            type: 'GET',
            data: {
                pageSize: _this.pageSize,
                pageNum: 10
            }
        }, function (obj) {
            var html = '';
            $.each(obj.list, function (i, b) {
                html += ' <dl class="ka_list"><a href="/html/credit_raise_quota_detail.html?bankName=' + b.bank_short_name + '&bankId=' + b.id + '"><dt><img src=' + b.bank_logo + '></dt><dd>' + b.bank_short_name + '';
                if (b.is_quota_link == 1) {
                    html += '<b>在线申请</b>';
                }
                html += '</dd></a></dl>';
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
    credit_raise_quota.initView();
})
