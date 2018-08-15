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
        weixin(json.data);
    },
    error: function () {}
});
var _title = '立即注册，与我分享奖励',
    _desc = '得积分兑红包,抽爱疯7!极速借款,上速贷之家!',
    _imgUrl = m_sudaizhijia_host + '/img/sudai_logo.png',
    _link = localStorage.linkUrl;

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
