var support_credit_card = {
    initView: function () {
        //        this.pageSize = 1;
        this.getLists();
        //        this.scroll();
    }, //列表
    getLists: function () {
            var _this = this;
            service.doAjaxRequest({
                url: '/v1/users/payment/card/quota/credit'
                , type: 'GET'
            }, function (obj) {
                var html = '';
                $.each(obj, function (i, b) {
                    html += '<li> <span>' + b.bankname + '</span> <span>' + b.single_quota + '</span> <span>' + b.oneday_quote + '</span> </li>';
                });
                $(".list").append(html);
                //            _this.pageCode = obj.pageCount;
                //            _this.pageSize++;
            });
        }
        //    ,
        //    scroll: function () {
        //        var _this = this;
        //        $(window).scroll(function () {　
        //            //判断滚动到底部
        //            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        //                if (_this.pageSize <= _this.pageCode) {
        //                    setTimeout(function () {
        //                        _this.getLists();
        //                    }, 300)
        //                } else {
        //                    $('#PullUp').html('已加载全部');
        //                }
        //            }
        //        });
        //    }
};
$(function () {
    support_credit_card.initView();
});