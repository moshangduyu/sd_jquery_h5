/*声明变量*/
var phonez = /^1[3|4|5|6|7|8|9]\d{9}$/;
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
//最初默认
var initial = {
    initView: function () {
        var that = this;
        if (!$.cookie('sd_equipment_id')) {
            that.initEquipmentView();
        }
    }, //定位统计传参--设备id
    initEquipmentView: function () {
        var userAgent = $.trim(navigator.userAgent),
            reviceNum = userAgent.substr(0, 12);
        var d = new Date(),
            timeNum = $.trim(d.getFullYear() + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + (d.getDate() < 10 ? "0" : "") + d.getDate() + (d.getHours() < 10 ? "0" : "") + d.getHours() + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes());

        function GetRandomNum(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        }
        var random = GetRandomNum(1000000000, 9999999999);
        var sd_equipment_id = $.trim(reviceNum) + "-" + timeNum + "-" + random;
        $.cookie('sd_equipment_id', sd_equipment_id, {
            expires: 360,
            path: '/'
        });
    }
};
$(function () {
    initial.initView();
});
var localFun = {
    //悬浮导航栏显示隐藏效果
    doFixedNav: function () {
        $('.fixed_nav').click(function () {
            if ($(this).hasClass('fixed_show')) {
                $(this).animate({
                    right: '-6rem'
                }, 300);
                $('.navCover').fadeOut(300, function () {
                    $('.navCover').remove()
                });
                $(this).removeClass('fixed_show');
            } else {
                $('.container').append('<div class="navCover"></div>');
                $('.navCover').css({
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'background': 'rgba(0,0,0,.2)',
                    'width': '100%',
                    'height': '100%',
                    'display': 'none'
                });
                $('.navCover').fadeIn(300);
                $(this).animate({
                    right: '0'
                }, 300);
                $(this).addClass('fixed_show')
            }
        })
    }, //底部下载弹窗
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

        function toAPP() {
            var weChatLink = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yeer.sdzj",
                iPhoneLink = "https://itunes.apple.com/cn/app/id1340669804?mt=8",
                AndroidApkLink = "http://download.sudaizhijia.com/android/sudaizhijia/v2/sdzj-last_release-cpa-sign.apk";
            if (Terminal.platform.weChat) {
                window.location.href = weChatLink;
            } else {
                if (Terminal.platform.iPhone) {
                    window.location.href = iPhoneLink;
                } else {
                    window.location.href = AndroidApkLink;
                }
            }
        }
        $(".download").click(function () {
            toAPP();
        })
    }, //星星展示
    star: function () {
        $.each($(".star"), function (a, b) {
            if ($(this).find("b").text() == 0) {
                $(this).find("i").eq(idx).css({
                    "background": "url('../img/starBig1.png')",
                    "background-size": "100% 100%"
                });
            } else {
                var reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(Number($(this).find("b").text()))) {
                    var zIdx = Math.floor($(this).find("b").text());
                    $(this).find("i").eq(zIdx).prevAll("i").css({
                        "background": "url('../img/starBig3.png')",
                        "background-size": "100% 100%"
                    });
                    $(this).find("i").eq(zIdx).css({
                        "background": "url('../img/starBig2.png')",
                        "background-size": "100% 100%"
                    });
                } else {
                    var idx = Number($(this).find("b").text()) - 1;
                    $(this).find("i").eq(idx).prevAll("i").css({
                        "background": "url('../img/starBig3.png')",
                        "background-size": "100% 100%"
                    });
                    $(this).find("i").eq(idx).css({
                        "background": "url('../img/starBig3.png')",
                        "background-size": "100% 100%"
                    });
                }
            }
        })
    }, //消息铃铛状态 
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
    }, //安卓手机键盘弹出footer位置
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
    }, //设置cookie失效时间(到凌晨0点)
    setCookieTime: function () {
        var cookietime = new Date(),
            hour = cookietime.getHours() * 60,
            minutes = cookietime.getMinutes(),
            surplus = 1440 - hour - minutes,
            starTime = cookietime.getTime();
        cookietime.setTime(starTime + (surplus * 60 * 1000));
        return cookietime;
    }, //banner跳转规则
    setBannerJump: function () {
        $(document).on('click', '.swiper-slide', function () {
            var href = String($(this).data('href'));
            if (href == 'chanpindaquan') {
                window.location.href = '/html/product.html';
            } else if (href == 'jingzhunpipei') {
                window.location.href = '/html/accurte_no.html';
            } else if (href == 'wode') {
                window.location.href = '/html/mine.html';
            } else if (href == 'gonglue') {
                window.location.href = '/html/strategy.html';
            } else if (href == 'jifen') {
                window.location.href = '/html/mine_points.html';
            } else if (href.indexOf('zixun') >= 0) {
                var id = href.replace(/[^0-9]/ig, "");
                window.location.href = '/html/consult_details.html?titleType=12&newsId=' + id;
            } else if (/^[0-9]+.?[0-9]*$/.test(href)) {
                window.location.href = '/html/product_result.html?productId=' + href;
            } else {
                if (href != '') {
                    window.location.href = href;
                }
            }
        });
    }
};
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
    }, //弹窗
    popupCover: function (opts) {
        $(".hintCover").remove();
        var defaults = {
            content: '',
            showTime: 1400,
            callback: '',
        }
        var option = $.extend({}, defaults, opts);
        $('body').append('<div class="hintCover"><div class="hintPopup"></div></div>');
        $('.hintPopup').text(option.content);
        $('.hintCover').css({
            "position": "fixed",
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
            "background": "white url('/img/sudaige.png') no-repeat .15rem center",
            "background-size": ".6rem .6rem",
            "opacity": .9,
            "color": '#747474',
            "font-size": .3 + "rem",
            "border-radius": .15 + "rem",
            "padding": ".25rem",
            "padding-left": ".85rem"
        });
        $('.hintPopup').css({
            "animation": "popupCover .25s ",
            "-webkit-animation": "popupCover .25s "
        });
        setTimeout(function () {
            $(".hintCover").fadeOut(350, option.callback);
            setTimeout(function () {
                $(".hintCover").remove();
            }, 500);
        }, .25 * 1000 + option.showTime);
    }, //消息提示
    promptCover: function (opts) {
        var defaults = {
            content: ''
        }
        var option = $.extend({}, defaults, opts);
        $('body').append('<div class="promptCover"><div class="promptPopup"><h3>温馨提示</h3><div class="popupContent"></div><div class="sureBtn gradient">朕知道了</div></div></div>');
        $('.popupContent').html(option.content);
        $('.promptCover').css({
            "position": "fixed",
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
    }, //登录状态事件触发
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
    }, //base64加密
    Base64: function () {
        // private property
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // public method for encoding
        this.encode = function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = _utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        }
        // public method for decoding
        this.decode = function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        }
        // private method for UTF-8 encoding
        _utf8_encode = function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        // private method for UTF-8 decoding
        _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }
});
document.write('<script src="/js/service/address.js"></script>');
document.write('<script src="/js/service/service.js"></script>');
