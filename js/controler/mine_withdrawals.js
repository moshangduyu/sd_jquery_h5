;
(function ($) {
    var $ipuMoney = $("input[type=number]"),
        $account_li = $(".account_ul>li");
    /*进页面是否显示提示弹窗*/
    if (!localStorage.withdrawalsCover) {
        $(".withdrawalsCover").show();
        $(".knowBtn").click(function () {
            $(".withdrawalsCover").hide();
        })
        local.withdrawalsCover = true;
    }
    /*------sanjiao------*/
    function triangle() {
        var sanjiao = true;
        $(".liImg").click(function () {
            if (sanjiao) {
                $account_li.eq(0).siblings("li").show();
                sanjiao = false;
            } else {
                $account_li.eq(0).siblings("li").hide();
                sanjiao = true;
            }
        })
        $(".account_ul").click(function (e) {
            e.stopPropagation();
            //            $(this).prependTo($(".account_ul"));
        })
        $(document).click(function () {
            $account_li.eq(0).siblings("li").hide();
            sanjiao = true;
        })
    }
    triangle();
    /*账户提现接口[查询]*/
    $.ajax({
        type: "get",
        url: api_sudaizhijia_host + "/v1/account/useraccount",
        dataType: "json",
        success: function (json) {
            if (json.code == 200 && json.error_code == 0) {
                var b = json.data;
                //用户账户现金
                $(".user_account").text(b.user_account);
                //支付宝账号
                $(".alipay").text(b.alipay);
                //全部提现
                $(".allTi").click(function () {
                    var user_account = b.user_account.replace(/,/g, "");
                    var allMoney = Math.floor(user_account);
                    $ipuMoney.val(allMoney);
                })
                /*提现btn*/
                $(".tixianBtn").click(function () {
                    var money = $ipuMoney.val().replace(/\b(0+)/gi, "");
                    if (money != '') {
                        $(".landingCover").show();
                        $.ajax({
                            type: "post",
                            url: api_sudaizhijia_host + "/v1/account/cash",
                            dataType: "json",
                            data: {
                                "money": money,
                                "account": $account_li.eq(0).find("em").text(),
                                "cashType": $account_li.eq(0).data("type"),
                            },
                            success: function (json) {
                                $(".landingCover").hide();
                                if (json.code == 200 && json.error_code == 0) {
                                    $(".popup").text('提现成功');
                                    $(".cover").css({
                                        "display": "block"
                                    }).fadeIn(500).delay(2000).fadeOut(500, function () {
                                        window.location.href = "/html/mine_cash.html";
                                    });
                                } else {
                                    alert(json.error_message);
                                }
                            }
                        })
                    }
                })
            } else {
                alert(json.error_message)
            }
        },
        error: function () {}
    })
})(jQuery);
