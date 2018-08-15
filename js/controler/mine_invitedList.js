var invitedListController = {
    initView: function () {
        var that = this;
        that.myScroll = new IScroll("#wrapper", {
            probeType: 3,
            mouseWheel: true,
            scrollbars: false,
            preventDefault: false,
            fadeScrollbars: true
        });
        that.page = 1;
    },
    //设置盒子最大高度
    doScrollBoxView: function () {
        var H = $(window).height(),
            headH = $("header").height(),
            centerH3 = $(".center_list>h3").height(),
            scrollBoxH = H - headH - centerH3 - 70;
        var ul_H = $(".dropdown-list").height();
        $("#wrapper").css({
            "max-height": scrollBoxH
        })
        if (ul_H <= scrollBoxH) {
            $(".landing").text("已加载全部邀请");
        }
    },
    //上拉加载
    doScrollView: function () {
        var that = this;
        that.isPulled = true; // 拉动标记
        that.myScroll.on('scroll', function () {
            var height = this.y,
                bottomHeight = height - this.maxScrollY;
            // 控制上拉显示
            if (that.isPulled && bottomHeight <= 50) {
                that.isPulled = false;
                if (that.page <= that.pageCount) {
                    that.doAjaxListView();
                }
            }
        })
    },
    //数据展示
    doAjaxListView: function (obj) {
        var that = this;
        var lis = "";
        $.each(obj.list, function (i, b) {
            lis += '<li><p> <span>' + b.mobile + '</span> <span>' + b.status + '</span> <span>￥' + b.invite_money + '</span> </p></li>';
        })
        $(".dropdown-list").append(lis);
        that.doScrollBoxView();
        that.pageCount = obj.pageCount;
        that.page++;
        if (that.page > that.pageCount) {
            $(".landing").text("已加载全部邀请");
        } else {
            $(".landing").text("上拉加载更多")
        }
        that.myScroll.refresh();
        that.isPulled = true;
    }
};
$(function () {
    invitedListController.initView();
    //5.3.3邀请流水接口
    service.doAjaxRequest({
        type: "GET",
        url: "/v1/invite/log",
        data: {
            "pageSize": invitedListController.page,
            "pageNum": 15
        }
    }, function (json) {
        invitedListController.doAjaxListView(json);
    });

})
