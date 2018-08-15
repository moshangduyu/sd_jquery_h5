var withdrawalsController = {
    initView: function () {
        var that = this;
        that.$ipuMoney = $("input[type=number]");
        that.$account_li = $(".account_ul>li");
        this.initShowView();
        this.initEventView();
        this.doTriangleView();
    },
    initShowView: function () {
        //进页面是否显示提示弹窗
        if (!localStorage.withdrawalsCover) {
            $(".withdrawalsCover").show();
            $(".knowBtn").click(function () {
                $(".withdrawalsCover").hide();
            })
            local.withdrawalsCover = true;
        }
    },
    initEventView: function () {
        var that = this;
        /*提现btn*/
        $(".tixianBtn").click(function () {
            var money = that.$ipuMoney.val().replace(/\b(0+)/gi, "");
            if (money != '') {
                service.doAjaxRequest({
                    type: "POST",
                    url: "/v1/account/cash",
                    data: {
                        "money": money,
                        "account": that.$account_li.eq(0).find("em").text(),
                        "cashType": that.$account_li.eq(0).data("type"),
                    },
                }, function () {
                    $.popupCover({
                        content: '提现成功',
                        callback: function () {
                            window.location.href = "/html/mine_cash.html";
                        }
                    })

                }, function (json) {
                    $.popupCover({
                        content: json.error_message

                    })
                })
            } else {
                $.popupCover({
                    content: '请输入提现额度'
                })
            }
        })
    },
    //三角选项
    doTriangleView: function () {
        var that = this;
        var sanjiao = true;
        $(".liImg").click(function () {
            if (sanjiao) {
                that.$account_li.eq(0).siblings("li").show();
                sanjiao = false;
            } else {
                that.$account_li.eq(0).siblings("li").hide();
                sanjiao = true;
            }
        })
        $(".account_ul").click(function (e) {
            e.stopPropagation();
        })
        $(document).click(function () {
            that.$account_li.eq(0).siblings("li").hide();
            sanjiao = true;
        })
    },
    //账户提现接口[查询展示]
    doAccountShowView: function (b) {
        var that = this;
        //用户账户现金
        $(".user_account").text(b.user_account);
        //支付宝账号
        $(".alipay").text(b.alipay);
        //全部提现
        $(".allTi").click(function () {
            var user_account = b.user_account.replace(/,/g, "");
            var allMoney = Math.floor(user_account);
            that.$ipuMoney.val(allMoney);
        })
    }
};

$(function () {
    withdrawalsController.initView();
    /*账户提现接口[查询]*/
    service.doAjaxRequest({
        type: "GET",
        url: "/v1/account/useraccount",
        data: {}
    }, function (b) {
        withdrawalsController.doAccountShowView(b);
    })
})
