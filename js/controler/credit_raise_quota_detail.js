var credit_raise_quota_detail = {
    initView: function () {
        this.initShowView();
        this.getContent();
        this.shenqing();
    },
    initShowView: function () {
        var bankName = $.GetQueryString('bankName');
        $('.title').text(bankName);
    },
    shenqing: function () {
        $(document).on('click', '.shenqing', function () {
            if (localStorage.userId) {
                window.location.href = $(this).data('href');
            } else {
                local.fromLogin = 1;
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        })

    },
    getContent: function () {
        var _this = this;
        var bankId = $.GetQueryString('bankId');
        service.doAjaxRequest({
            url: '/v1/banks/quota',
            type: 'GET',
            data: {
                bankId: bankId
            }
        }, function (obj) {
            var html = '';
            if (obj.quota_link != '') {
                html += '<div><h3>在线一键提额</h3><a data-href="' + obj.quota_link + '" class="shenqing">立即申请</a></div>';
            }
            if (obj.service_mobile != '') {
                html += '<div class="tel_box"><h3>电话提额</h3><p>' + obj.mobile_quota + '</p><h6><img src="/img/credit_raise_quota_detail_tan.png" alt="">调额周期：每三个月即可成功申请一次</h6><a href="tel:' + obj.service_mobile + '">拨打客服（' + obj.service_mobile + '）</a></div>';
            }
            if (obj.wechat_quota != '') {
                html += '<div><h3>微信提额</h3><p>' + obj.wechat_quota + '</p></div>';
            }
            if (obj.quota_mobile != '') {
                html += '<div><h3>短信提额</h3><p>' + obj.sms_quota + '</p>';
                if (Terminal.platform.iPhone) {
                    html += '<a href="sms:' + obj.quota_mobile + '&body=' + obj.sms_content + '">发送短信</a></div>';
                } else {
                    html += '<a href="sms:' + obj.quota_mobile + '?body=' + obj.sms_content + '">发送短信</a></div>';
                }

            }
            $('.content_list').html(html);
        });
    }
};
$(function () {
    credit_raise_quota_detail.initView();
})
