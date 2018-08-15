var integralController = {
    initView: function () {
        this.doTabChangeView();
        this.doShareView();
        this.doWxView();
    },
    //判断是否是微信浏览器
    initTerminalView: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    //积分页面数据显示
    getIntegralView: function (b) {
        var html1 = "";
        // 我的积分
        $(".userScore").html(b.user_score);
        // 他人积分
        $(".maxScore").html(b.max_score);
        //积分广告
        $(".head-btm-p").text(b.credit_remark);
        //存储分享链接
        local.linkUrl = b.h5_only_share_link;
        // 是否完善用户信息 1 已完成 0 未完成
        if (b.info_sign == 1) $(".status").text("已完成");
        /*邀请好友申请状态*/
        var idx = 0;
        $.each(b.invite, function (i, t) {
            $('.share').eq(idx).attr('data-sign', t.invite_sign);
            idx++;
        })
        $.each($('.share'), function () {
            if ($(this).data('sign') == 1) $(this).text("已完成");
        })
        /*product list*/
        $.each(b.product_apply, function (x, y) {
            html1 += '<div data-id=' + y.product_id + ' class="pro"><dl data-consigId=' + y.config_id + '><dt><img src=' + y.product_logo + '></dt><dd><h3>申请 <em>' + y.product_name + '</em> </h3><p class="p1">积分+<b>' + y.config_credits + '</b></p><p class="p2">点击前往</p></dd></dl> <span class="toApply" data-sign=' + y.apply_sign + '><em>待完成</em><i>去申请</i></span> </div>'
        })
        $(".change1_product").html(html1);
        $.each($('.toApply'), function () {
            if ($(this).data('sign') == 1) {
                $(this).find("em").text("已完成");
                $(this).find("i").addClass("alreadyApplied");
            };
        });
        /*产品详情*/
        $(".toApply").off('click').on("click", function () {
            if ($(this).find("i").hasClass("alreadyApplied")) {
                return false;
            } else {
                var chanpinid = $(this).parents('.pro').data('id');
                window.location.href = "/html/product_result.html?productId=" + chanpinid;
            }
        })
    },
    //触发分享显示样式
    doShareView: function () {
        var that = this;
        $(".share").click(function () {
            if (that.initTerminalView()) {
                /*是微信*/
                $(".wx_fen").css({
                    "display": "block"
                }).fadeIn(0).delay(3000).fadeOut(100)
                $(".wx_fen").click(function () {
                    $(this).hide()
                })
            } else {
                $(".ll_fen").css({
                    "display": "block"
                }).fadeIn(0).delay(3000).fadeOut(100)
                $(".ll_fen").click(function () {
                    $(this).hide()
                })
            }
        })
    },
    //积分兑换-显示
    getintegralCash: function (b) {
        //我的积分
        $(".userScore").text(b.user_score);
        //兑换积分
        $(".exchang_jifen").text(b.cash_credits);
        //兑换额度
        $(".exchange_money").text(b.cash_money);
    },
    //积分兑换-兑换
    doExchangeView: function () {
        var expend_credits = $(".exchang_jifen").text(),
            income_money = $(".exchangeMoney").text();
        if (confirm("是否兑换" + expend_credits + "积分?")) {
            service.doAjaxRequest({
                url: '/v1/credit/creditcash',
                type: 'POST',
                data: {
                    "expend_credits": expend_credits,
                    "income_money": income_money
                }
            }, function (json) {
                $.popupCover({
                    content: "兑换成功",
                    callback: function () {
                        window.location.reload()
                    }
                })
            }, function (json) {
                $.popupCover({
                    content: json.error_message
                })
            });
        }
    },
    //tab切换
    doTabChangeView: function () {
        $(".tab_span").click(function () {
            var idx = $(this).index();
            $(this).addClass("spanClick").siblings().removeClass("spanClick");
            $(".integral-tab-change").eq(idx).show().siblings(".integral-tab-change").hide();
        })
    },
    //自定义分享
    doWxView: function () {
        var url = location.href.split("#")[0];
        var _title = '立即注册，与我分享奖励',
            _desc = '得积分兑红包,抽爱疯7!极速贷款,上速贷之家!',
            _imgUrl = m_sudaizhijia_host + '/img/sudai_logo.png',
            _link = localStorage.linkUrl;
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
    integralController.initView();

    /*积分页面数据显示*/
    service.doAjaxRequest({
        url: '/v1/credit',
        type: 'GET'
    }, function (json) {
        integralController.getIntegralView(json);
    })

    //1.积分兑换-显示
    service.doAjaxRequest({
        url: '/v1/credit/cash',
        type: 'GET'
    }, function (json) {
        integralController.getintegralCash(json);
    });

    //2.积分兑换-兑换
    $(".cashRemind").click(function () {
        integralController.doExchangeView();
    });

})
