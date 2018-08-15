;
(function ($) {
    window.onload = function () {
        var myScroll = new IScroll("#wrapper", {
            probeType: 3
            , mouseWheel: true
            , scrollbars: false
            , preventDefault: false
            , fadeScrollbars: true
        });
        var page = 1;
        /*设置盒子最大高度*/
        function scrollBox() {
            var H = $(window).height()
                , headH = $("header").height()
                , centerH3 = $(".center_list>h3").height()
                , scrollBoxH = H - headH - centerH3 - 70;
            var ul_H = $(".dropdown-list").height();
            $("#wrapper").css({
                "max-height": scrollBoxH
            })
            if (ul_H <= scrollBoxH) {
                $(".landing").text("已加载全部邀请");
            }
        }
        //5.3.3邀请流水接口
        fetchInviteLog();

        function fetchInviteLog() {
            $.ajax({
                type: "get"
                , url: api_sudaizhijia_host + "/v1/invite/log"
                , dataType: "json"
                , data: {
                    "pageSize": page
                    , "pageNum": 15
                }
                , success: function (json) {
                    if (json.code == 200 && json.error_code == 0) {
                        var lis = "";
                        $.each(json.data.list, function (i, b) {
                            lis += '<li><p> <span>' + b.mobile + '</span> <span>' + b.status + '</span> <span>￥' + b.invite_money + '</span> </p></li>';
                        })
                        $(".dropdown-list").append(lis);
                        scrollBox();
                        myScroll.refresh();
                        pageCount = json.data.pageCount;
                        page++;
                        if (page > pageCount) {
                            $(".landing").text("已加载全部邀请");
                        }
                        else {
                            $(".landing").text("上拉加载更多")
                        }
                        isPulled = true;
                    }
                    else {
                        alert(json.error_message);
                    }
                }
            })
        }
        /*---------上拉加载-----------*/
        var isPulled = true; // 拉动标记
        myScroll.on('scroll', function () {
            var height = this.y
                , bottomHeight = height - this.maxScrollY;
            console.log(bottomHeight)
                // 控制上拉显示
            if (isPulled && bottomHeight <= 50) {
                isPulled = false;
                if (page <= pageCount) {
                    fetchInviteLog();
                }
                myScroll.refresh();
            }
        })
    };
})(jQuery);