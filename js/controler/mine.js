var mineController = {
    initView: function () {
        localFun.downloadCover(.9); //底部下载弹窗
        localFun.messageIcon(); //消息铃铛
        this.doMyInformationView();
        this.doMenuJumpView();
    },
    //我的信息展示
    doMyInformationView: function () {
        if (localStorage.userId) {
            service.doAjaxRequest({
                url: '/v1/credit/index',
                type: 'GET'
            }, function (b) {
                $(".mimnejifen").html(b.userScore + "分");
                $(".mineCash").html(b.userAccount + "元");
                $(".mine_username").html(b.username).css({
                    "text-decoration": "none"
                });
                $(".mimnejifen,.mineCash").css({
                    "text-decoration": "underline"
                });
            });
        } else {
            $(".mine_username>a").text("请登录");
            $(".mimnejifen,.mineCash").text("--")
        }
    },
    //功能菜单跳转交互
    doMenuJumpView: function () {
        //用户登录状态
        $.LogonStatusEvent($(".pleaseLogin"), function () {
            return false;
        });
        //积分跳转
        $.LogonStatusEvent($(".jifen"), function () {
            window.location.href = "/html/mine_integral.html"
        });
        /*现金跳转*/
        $.LogonStatusEvent($(".cash"), function () {
            window.location.href = "/html/mine_cash.html"
        });
        /*邀请好友*/
        $.LogonStatusEvent($(".mmbl_invite"), function () {
            window.location.href = "/html/mine_invite_friends.html"
        });
        /*信用资料*/
        $.LogonStatusEvent($(".mmbl_xinxi"), function () {
            window.location.href = "/html/accurate.html"
        });
        /*修改身份*/
        $.LogonStatusEvent($(".mmbl_shenfen"), function () {
            window.location.href = "/html/mine_personal_shenfen.html"
        });
        /*我的收藏*/
        $.LogonStatusEvent($(".mmbl_shoucang"), function () {
            window.location.href = "/html/mine_collect.html"
        });
        /*关注速贷之家微信公众号*/
        $(".mmbl_weixin").click(function () {
            $(".follow_cover").show();
        })
        $(".fc_btn").click(function () {
            $(".follow_cover").hide();
        });
        /*帮助跳转*/
        $(".mmbl_bangzhu").click(function () {
            window.location.href = "/html/mine_help.html"
        });
        /*设置跳转*/
        $(".mmbl_shezhi").click(function () {
            window.location.href = "/html/mine_personal_setup.html"
        })
    }
};
$(function () {
    mineController.initView();
});
