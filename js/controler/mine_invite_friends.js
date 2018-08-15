var InvitingFriendsController = {
    initView: function () {
        var that = this;
        this.initShowView();
        this.initEventView.initView();
        this.doWxView();
    },
    initShowView: function () {
        $(".username>span").text(localStorage.username);
    },
    initEventView: {
        initView: function () {
            this.doShareCoverView();
            this.doScanView();
            this.doInformationView();
        },
        //分享弹窗
        doShareCoverView: function () {
            $(".fenxiangBox").click(function () {
                if (Terminal.platform.weChat) {
                    /*是微信*/
                    $(".wx_fen").css({
                        "display": "block"
                    }).fadeIn(0).delay(3000).fadeOut(100);
                    $(".wx_fen").click(function () {
                        $(this).hide()
                    })
                } else {
                    $(".ll_fen").css({
                        "display": "block"
                    }).fadeIn(0).delay(3000).fadeOut(100);
                    $(".ll_fen").click(function () {
                        $(this).hide()
                    })
                }
            });
        },
        //身边朋友扫一下
        doScanView: function () {
            $(".sweepCover").click(function () {
                $(".follow_cover").show();
            });
            $(".fc_btn").click(function () {
                $(".follow_cover").hide();
            });
        },
        //给朋友发短信
        doInformationView: function () {
            $(".phoneBtn").click(function () {
                $(".phone_cover").show();
            });
            $(".phone_cover>div").click(function (e) {
                e.stopPropagation();
                var Url = $(this).find("textarea");
                Url.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
            });
            $(".phone_cover").click(function () {
                $(this).hide();
            });
        }
    },
    //邀请流水接口
    doLogView: function (obj) {
        var lis = "";
        var len = obj.list.length;
        $.each(obj.list, function (i, b) {
            lis += '<p> <span>' + b.mobile + '</span> <span>' + b.status + '</span> <span>￥' + b.invite_money + '</span> </p>';
        })
        $(".liList").html(lis);
        //查看更多
        $(".seeMore").click(function () {
            if (len <= 1) {
                $.popupCover({
                    content: '没有更多了！'
                })
            } else {
                window.location.href = "/html/mine_invitedList.html";
            }
        })
    },
    //自定义微信分享样式
    doWxView: function () {
        var url = location.href.split("#")[0];
        var _title = '立即注册，与我分享奖励',
            _desc = '得积分兑红包,抽爱疯7!极速借款,上速贷之家!',
            _imgUrl = m_sudaizhijia_host + '/img/sudai_logo.png',
            _link = localStorage.linkUrl;
        service.wechatShare({
            url: url
        }, function (json) {
            weixin(json);
        });

        function weixin(json) {
            wx.config({
                debug: false,
                appId: json.appId,
                timestamp: json.timestamp,
                nonceStr: json.nonceStr,
                signature: json.signature,
                jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"]
            });
            wx.ready(function () {
                //分享给好友
                wx.onMenuShareAppMessage({
                    title: _title,
                    desc: _desc,
                    link: _link,
                    imgUrl: _imgUrl,
                    type: 'link',
                    dataUrl: '',
                    success: function () {},
                    cancel: function (xhr) {}
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: _title,
                    desc: _desc,
                    link: _link,
                    imgUrl: _imgUrl,
                    success: function () {},
                    cancel: function () {}
                });
                wx.error(function (res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败
                });
            });
        }
    }
};
$(function () {
    InvitingFriendsController.initView();
    //邀请好友接口
    service.doAjaxRequest({
        url: '/v1/invite',
        type: 'GET',
        data: {}
    }, function (b) {
        $(".section_top>h6").text(b.extra_money);
        $("textarea").val(b.sms_content);
        local.linkUrl = b.share_link; //存储分享链接
    });
    //生成二维码接口
    $.ajax({
        type: "get",
        url: api_sudaizhijia_host + "/v1/invite/qrcode",
        data: {
            "size": 200
        },
        success: function (html) {
            $(".erma").html(html)
        }
    });
    //邀请流水接口
    service.doAjaxRequest({
        type: "GET",
        url: "/v1/invite/log",
        data: {
            "pageSize": 1,
            "pageNum": 3
        },
    }, function (json) {
        InvitingFriendsController.doLogView(json);
    });
    $(window).load(function () {
        var myscroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        myscroll.refresh();
    })
});
