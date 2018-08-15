var consultDetailsController = {
    initView: function () {
        var that = this;
        that.myscroll = new iScroll("wrapper", {
            vScrollbar: false
        });
        //截取地址栏信息
        that.newsId = $.GetQueryString("newsId");
        that.fromLogin = $.GetQueryString("fromLogin");
        that.titleType = $.GetQueryString("titleType");
        this.initShowTitleView();
        this.doEventView.initView();
    },
    //判断title显示
    initShowTitleView: function () {
        var that = this;
        switch (that.titleType) {
            case '11':
                $('title').text('速贷之家-活动详情');
                $('.title').text('活动详情');
                break;
            case '12':
                $('title').text('速贷之家-攻略详情');
                $('.title').text('攻略详情');
                break;
            case '13':
                $('title').text('速贷之家-咨讯详情');
                $('.title').text('咨讯详情');
                break;
        };
    },
    //事件操作
    doEventView: {
        that: this,
        initView: function () {
            this.doBackView();
        },
        //返回按钮
        doBackView: function () {
            var that = this;
            $(".back").click(function () {
                if (that.fromLogin == '1') {
                    window.location = localStorage.backHref
                } else {
                    javascript: history.back(-1);
                }
            });
        }

    },
    //页面内容渲染
    doContentAjaxView: function (obj) {
        var that = this;
        var html = "";
        html = "<h3>" + obj.title + "</h3>" + "<p>" + "<span>" + obj.create_time + "</span>" + "<span>" + "<img src='../img/%E5%B7%B2%E7%9C%8B.png' alt=''>" + "<i>" + obj.visit_count + "</i>" + "</span>" + "</p>" + "<p data-img=" + obj.cover_img + " id='fx_img'></p>" + "<div id='content'>" + obj.content + "</div>" + "<h1 style='height:.2rem'></h1>";
        $(".iscroll").append(html);
        /*设置center中所有图片的宽度*/
        var allImg = $("#content").find("img");
        $.each(allImg, function (i, obj) {
            var oWidth = $(obj).width();
            var oSrc = $(obj).attr('src');
            var nSrc = sd_protocol + api_sudaizhijia_host + oSrc;
            $(obj).attr('src', nSrc);
            $("<img>").attr('src', nSrc).load(function () {
                var realWidth = this.width;
                var wraW = $("#wrapper").width();
                var width = wraW - 30;
                if (realWidth > wraW) {
                    allImg.css({
                        "width": width
                    })
                }
            })
        })
        /*判断是否显示底部图片*/
        if (obj.footer_img != "") {
            $("#content").append("<div><img src=" + obj.footer_img + " class='btmImg'><div>")
            $(".btmImg").click(function () {
                if (obj.footer_img_inapp_link != "") {
                    window.location.href = obj.footer_img_inapp_link
                }
            })
        }
        that.doWxShareView();
    },
    //微信分享样式
    doWxShareView: function () {
        var url = location.href.split("#")[0];
        $.ajax({
            type: "post",
            url: api_sudaizhijia_host + "/v1/wechat",
            dataType: "json",
            data: {
                url: url
            },
            beforeSend: function () {},
            success: function (json) {
                weixin(json);
            },
            error: function () {}
        });
        var _title = $("h3").text(),
            _desc = '简单高效,想借就借。极速贷款,上速贷之家!',
            _link = window.location.href,
            _imgUrl = $("#fx_img").data("img");

        function weixin(json) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: json.data.appId, // 必填，公众号的唯一标识
                timestamp: json.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: json.data.nonceStr, // 必填，生成签名的随机串
                signature: json.data.signature, // 必填，签名，见附录1
                jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                //分享给好友
                wx.onMenuShareAppMessage({
                    title: _title, // 分享标题
                    desc: _desc, // 分享描述
                    link: _link, // 分享链接
                    imgUrl: _imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {},
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: _title, // 分享标题
                    desc: _desc, // 分享描述
                    link: _link, // 分享链接
                    imgUrl: _imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.error(function (res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败
                });
            });
        }
    }

};
$(function () {
    consultDetailsController.initView();
    /*页面内容渲染*/
    service.doAjaxRequest({
        url: '/v1/news/detail',
        type: 'GET',
        data: {
            "newsId": consultDetailsController.newsId
        }
    }, function (json) {
        consultDetailsController.doContentAjaxView(json);
    });
});
$(window).load(function () {
    var myscroll = new iScroll("wrapper", {
        vScrollbar: false
    });
    myscroll.refresh();
    myscroll.on('scroll', function () {
        myscroll.refresh();
    })
});
