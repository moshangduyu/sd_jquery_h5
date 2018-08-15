var mineController = {
    initView: function () {
        localFun.doFixedNav(); //悬浮导航栏
        localFun.downloadCover(0); //底部下载弹窗
        localFun.messageIcon(); //消息铃铛
        this.doMyInformationView();
        this.doMenuJumpView();
    },
    //我的信息展示
    doMyInformationView: function () {
        var _this = this;

        if (localStorage.userId) {
            service.doAjaxRequest({
                url: '/v1/users/info',
                type: 'GET'
            }, function (b) {
                //头像
                if (b.user_photo != '') {
                    _this.cropImg(b.user_photo);
                } else {
                    $('#show_img').css({
                        "background-image": "url(../img/sudaidai.png)",
                        "background-size": '100% 100%'
                    });
                }
                //用户名
                $(".mine_username").html(b.username);
                local.username = b.username;
                local.hidePhone = b.mobile;
                local.indent = b.indent;
                //积分
                $(".mimnejifen").html(b.userScore);
                local.userScore = b.userScore;
                //现金
                $(".mineCash").html(b.userAccount);
                //是否签到
                if (b.user_sign == 1) {
                    $('.sign').addClass('signed').find('i').text('今日已签到');
                }
            });
        } else {
            $('#show_img').css({
                "background-image": "url(../img/sudaidai.png)",
                "background-size": '100% 100%'
            });
            $(".mine_username>a").text("立即登录");
            $(".mimnejifen,.mineCash").text("--")
        }
    },
    //功能菜单跳转交互
    doMenuJumpView: function () {
        //用户登录状态
        $.LogonStatusEvent($("#mine"), function () {
            window.location.href = "mine_account_information.html";
        });
        //积分跳转
        $.LogonStatusEvent($(".jifen"), function () {
            window.location.href = "/html/mine_points.html"
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
        /*我的申请*/
        $.LogonStatusEvent($(".mmbl_shenqing"), function () {
            window.location.href = "/html/mine_apply.html"
        });

        /*我的关注*/
        $.LogonStatusEvent($(".mmbl_shoucang"), function () {
            window.location.href = "/html/mine_collect.html"
        });
        /*积分商城*/
        $(".mmbl_jifen").on('click', function () {
            //判断ios
            if (Terminal.platform.iPhone) {
                service.getShop({
                    "redirect": ''
                }, function (obj) {
                    window.location.href = obj.redirect_url;
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
            } else {
                window.location.href = "/html/integral_mall.html";
            }

        });
        /*关注速贷之家微信公众号*/
        $(".mmbl_weixin").click(function () {
            $(".follow_cover").show();
        })
        $(".fc_btn").click(function () {
            $(".follow_cover").hide();
        });

        /*智能匹配*/
        $(".mmbl_pipei").click(function () {
            window.location.href = "/html/accurte_no.html"
        });
        /*帮助中心*/
        $(".mmbl_bangzhu").click(function () {
            window.location.href = "/html/mine_help.html"
        });
        /*设置跳转*/
        $(".mmbl_shezhi").click(function () {
            window.location.href = "/html/mine_personal_setup.html"
        });
        /*签到*/
        $(".sign").on('click', function () {
            if (localStorage.userId) {
                if ($(this).hasClass('signed')) {
                    $.popupCover({
                        content: '今日已签到，明日再来~'
                    });
                    return;
                } else {
                    service.doAjaxRequest({
                        url: '/v1/sign',
                        type: 'GET'
                    }, function (obj) {
                        $('.sign').addClass('signed').find('i').text('今日已签到');
                        var userScore = Number($(".mimnejifen").text()) + 5;
                        $(".mimnejifen").text(userScore);
                        $.popupCover({
                            content: '签到成功!'
                        })
                    }, function (obj) {
                        $.popupCover({
                            content: obj.error_message
                        })
                    });
                }
            } else {
                local.login_reffer = window.location.href;
                window.location.href = '../html/login.html';
            }
        });

    },
    //图片裁剪
    cropImg: function (user_photo) {
        $('#hide_img').attr('src', user_photo);
        $("#hide_img").load(function () {
            var imgW = $('#hide_img').width(),
                imgH = $('#hide_img').height();
            if (imgW > imgH) {
                $('#show_img').css({
                    "background-image": "url(" + user_photo + ")",
                    "background-size": 'auto 100%'
                })
            } else if (imgW < imgH) {
                $('#show_img').css({
                    "background-image": "url(" + user_photo + ")",
                    "background-size": "100% auto"
                })
            } else {
                $('#show_img').css({
                    "background-image": "url(" + user_photo + ")",
                    "background-size": "100% 100%"
                })
            }
        })
    }
};
$(function () {
    mineController.initView();
});
