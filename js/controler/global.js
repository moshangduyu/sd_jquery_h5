/*声明变量*/
var phonez = /^1[3|4|5|7|8]\d{9}$/;
/*--判断终端--*/
var Terminal = {
    platform: (function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 || /(iPhone|iPod|iOS)/i.test(u.userAgent) || !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            iPad: u.indexOf('iPad') > -1 || /(iPad)/i.test(u.userAgent),
            weChat: u.indexOf('MicroMessenger') > -1
        };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
var localFun = {
    //底部下载弹窗
    downloadCover: function (btm) {
        var downloadVal = $.cookie('downloadVal') || '';
        var url = window.location.pathname;
        var cover = '<div class="downloadCover">' + '<img src="../img/downloadBg.png" alt="" class="download">' + '<img src="../img/coverBtn.png" alt="" class="coverBtn">' + '</div>';
        $(".container").append(cover);
        $(".downloadCover").css({
            "bottom": btm + "rem"
        })
        $(".download").css({
            "width": 100 + "%",
            "height": "auto"
        })
        if (downloadVal == "" || url == '/html/index_list.html') {
            $(".downloadCover").show();
        }
        $(".coverBtn").click(function () {
            $(".downloadCover").hide();
            $.cookie('downloadVal', 'false', {
                expires: 3,
                path: '/'
            });
        })
        $(".download").click(function () {
            if (Terminal.platform.weChat) {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yeer.sdzj";
            } else {
                if (Terminal.platform.iPhone) {
                    window.location.href = "https://itunes.apple.com/us/app/su-dai-zhi-jia-di-xi-jie-qian/id1116867896?mt=8";
                } else {
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yeer.sdzj";
                }
            }
        })
    },
    //大星星展示
    starBig: function () {
        $.each($(".product_daxing"), function (a, b) {
            if ($(this).find("b").text() == 0) {
                $(this).find("i").eq(idx).css({
                    "background": "url('../img/%E6%98%9F-%E5%A4%A72.png')",
                    "background-size": "100% 100%"
                });
            } else {
                var reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(Number($(this).find("b").text()))) {
                    var zIdx = Math.floor($(this).find("b").text());
                    $(this).find("i").eq(zIdx).prevAll("i").css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                        "background-size": "100% 100%"
                    });
                    $(this).find("i").eq(zIdx).css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A7.png')",
                        "background-size": "100% 100%"
                    });
                } else {
                    var idx = Number($(this).find("b").text()) - 1;
                    $(this).find("i").eq(idx).prevAll("i").css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                        "background-size": "100% 100%"
                    });
                    $(this).find("i").eq(idx).css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                        "background-size": "100% 100%"
                    });
                }
            }
        })
    },
    //小星星展示
    starSmall: function () {
        $(".product_xing>b").css({
            "display": "none"
        })
        $.each($(".product_xing"), function (a, b) {
            if ($(this).find("b").text() == 0) {
                $(this).find("i").eq(idx).css({
                    "background": "url('../img/%E6%98%9F2.png')",
                    "background-size": "100% 100%"
                });
            } else {
                var reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(Number($(this).find("b").text()))) {
                    var zIdx = Math.floor($(this).find("b").text());
                    $(this).find("i").eq(zIdx).prevAll("i").css({
                        "background": "url('../img/%E6%98%9F1.png')",
                        "background-size": "100% 100%"
                    });
                    $(this).find("i").eq(zIdx).css({
                        "background": "url('../img/%E5%8D%8A%E6%98%9F.png')",
                        "background-size": "100% 100%"
                    });
                } else {
                    var idx = Number($(this).find("b").text()) - 1;
                    $(this).find("i").eq(idx).prevAll("i").css({
                        "background": "url('../img/%E6%98%9F1.png')",
                        "background-size": "100% 100%"
                    });
                    $(this).find("i").eq(idx).css({
                        "background": "url('../img/%E6%98%9F1.png')",
                        "background-size": "100% 100%"
                    });
                }
            }
        })
    },
    //消息铃铛状态 
    messageIcon: function () {
        var message_noticeIs = $.cookie('message_notice') || '';
        if (message_noticeIs != 'false') {
            $(".message").css({
                "background": 'url("../img/xiaoxi1@3x.png")',
                "background-size": 100 + '%' + 100 + '%'
            });
        };
        /*头部消息*/
        $(".message").click(function () {
            if (localStorage.userId) {
                window.location.href = "/html/message.html"
            } else {
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html"
            }
        });
    },
    //安卓手机键盘弹出footer位置
    resizeFooter: function () {
        var H = $(window).height();
        $(window).resize(function () {
            var h = $(window).height();
            if (h < H) {
                $("footer").hide();
                $(".next").hide();
            } else {
                $("footer").show();
                $(".next").show();
            }
        });
    },
    //设置cookie失效时间(到凌晨0点)
    setCookieTime: function () {
        var cookietime = new Date(),
            hour = cookietime.getHours() * 60,
            minutes = cookietime.getMinutes(),
            surplus = 1440 - hour - minutes,
            starTime = cookietime.getTime();
        cookietime.setTime(starTime + (surplus * 60 * 1000));
        return cookietime;
    }
}
$.extend({
    //截取地址栏传参
    GetQueryString: function (name) {
        var url = decodeURI(location.search);
        var object = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {　　　　　　　　
                object[strs[i].split("=")[0]] = strs[i].split("=")[1]　　　　　　
            }　　
        }
        return object[name];
    },
    //弹窗
    popupCover: function (opts) {
        $(".hintCover").remove();
        var defaults = {
            content: '',
            showTime: 2000,
            callback: '',
        }
        var option = $.extend({}, defaults, opts);
        $('.container').append('<div class="hintCover"><div class="hintPopup"></div></div>');
        $('.hintPopup').text(option.content);
        $('.hintCover').css({
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": 100 + "%",
            "height": 100 + "%",
            "background": "rgba(0,0,0,.2)",
            "z-index": "99999",
            "text-align": "center"
        });
        $('.hintPopup').css({
            "margin-top": "4rem",
            "max-width": "5rem",
            "display": "inline-block",
            "text-align": "left",
            "background": "white url('../img/sudaige.png') no-repeat .15rem center",
            "background-size": ".6rem .6rem",
            "opacity": .9,
            "color": '#747474',
            "font-size": .3 + "rem",
            "border-radius": .15 + "rem",
            "padding": ".25rem",
            "padding-left": ".85rem"
        });

        $(".hintCover").css({
            "display": "block"
        }).fadeIn(500).delay(option.showTime).fadeOut(500, option.callback);

        setTimeout(function () {
            $(".hintCover").remove()
        }, option.showTime + 800);
    },
    //消息提示
    promptCover: function (opts) {
        var defaults = {
            content: '',
        }
        var option = $.extend({}, defaults, opts);
        $('.container').append('<div class="promptCover"><div class="promptPopup"><h3>温馨提示</h3><div class="popupContent"></div><div class="sureBtn gradient">朕知道了</div></div></div>');
        $('.popupContent').html(option.content);
        $('.promptCover').css({
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": 100 + "%",
            "height": 100 + "%",
            "background": "rgba(0,0,0,.2)",
            "z-index": "99999"
        });
        $('.promptPopup').css({
            "width": "5.25rem",
            "position": "absolute",
            "top": 50 + "%",
            "left": 50 + "%",
            "transform": "translate(-50% ,-50%)",
            "-webkit-transform": "translate(-50% ,-50%)",
            "line-height": .42 + "rem",
            "background": "white",
            "border-radius": .2 + "rem"
        });
        $('.promptPopup>h3').css({
            "text-align": "center",
            "color": "#606060",
            "padding-top": .35 + "rem",
            "font-size": ".32rem"
        });
        $('.popupContent').css({
            "color": "#808080",
            "font-size": ".26rem",
            "padding-left": .4 + "rem",
            "padding-right": .4 + "rem",
            "padding-top": .25 + "rem",
            "padding-bottom": .35 + "rem",
            "text-indent": "2em"
        });
        $('.sureBtn').css({
            "text-align": "center",
            "color": "white",
            "font-size": ".3rem",
            "width": "100%",
            "height": ".72rem",
            "line-height": ".72rem",
            "border-bottom-left-radius": .2 + "rem",
            "border-bottom-right-radius": .2 + "rem"
        });
        $('.sureBtn').click(function () {
            $('.promptCover').remove();
        })
    },
    //登录状态事件触发
    LogonStatusEvent: function ($dom, loginIn, notLogin) {
        notLogin = notLogin || $.noop;
        $dom.click(function () {
            if (localStorage.userId) {
                loginIn();
            } else {
                notLogin();
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        })
    }

});
document.write('<script src="/js/service/address.js"></script>');
document.write('<script src="/js/service/service.js"></script>');
