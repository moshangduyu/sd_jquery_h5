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
                title: $(".productName").text() + "-速贷之家", // 分享标题
                desc: '全网速审,实战攻略,免息红包,上速贷之家!', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: m_sudaizhijia_host + '/img/sudai_logo.png', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {},
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: $(".productName").text() + "-速贷之家", // 分享标题
                desc: '全网速审,实战攻略,免息红包,上速贷之家!', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: m_sudaizhijia_host + '/img/sudai_logo.png', // 分享图标
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
