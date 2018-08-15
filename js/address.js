var sd_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");;
//var sd_protocol = (("https:" == document.location.protocol) ? " https://test." : " http://test.");;
/*----接口地址----------------*/
var api_sudaizhijia_host = sd_protocol + "api.sudaizhijia.com";
var mapi_sudaizhijia_host = sd_protocol + "mapi.sudaizhijia.com";
/*----微信分享地址----------------*/
var m_sudaizhijia_host = sd_protocol + "m.sudaizhijia.com";
/*----微信落地页分享地址----------------*/
var we_landing = sd_protocol + "event.sudaizhijia.com/m/landing/index.html";
/*----截取地址栏信息----------------*/
function GetQueryString(name) {
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
}
/*----cookie存储----------------*/
var sudai_plat_fr = GetQueryString("sd_plat_fr");
if (sudai_plat_fr) {
    $.cookie('sd_plat_fr', sudai_plat_fr, {
        expires: 1,
        path: '/'
    });
};
var sd_plat_fr = $.cookie('sd_plat_fr') || '';
/*----本地存储变量----------------*/
var localStorageSupported = ("localStorage" in window);
if (!localStorageSupported) {
    if (confirm('不支持HTML5 localStorage, 请使用现代浏览器')) {
        window.location.href = "http://event.sudaizhijia.com/m/appdownload/index.html"
    }
}
var local = window.localStorage;
//存储landing图
local.landingImg = m_sudaizhijia_host + '/img/load2.gif';
/*----手机号正则----------------*/
var phonez = /^1[3|4|5|7|8]\d{9}$/;
/*----cover弹窗----------------*/
function coverShow(Function) {
    $(".cover").css({
        "display": "block"
    }).fadeIn(500).delay(2000).fadeOut(500, Function);
    $(".popup").css({
        "transform": "translate(-50% ,-50%)",
        "-webkit-transform": "translate(-50% ,-50%)",
        "text-align": "center"
    })
}
/*----判断终端----------------*/
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
    })(), // 终端的语言
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
//ios切换HTTPS请求
//if (Terminal.platform.iPhone) {
//    var targetProtocol = "https:";
//    if (window.location.protocol != targetProtocol) window.location.href = targetProtocol + window.location.href.substring(window.location.protocol.length);
//}
/*----底部下载弹窗----------------*/
function downloadCover(btm) {
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
};
/*----设置AJAX的全局默认选项----------------*/
var landingImg = false;
//utf-8转utf-16
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
$.ajaxSetup({
    beforeSend: function (xhr) {
        //添加缓冲动画
        if (landingImg) {} else {
            $(".container").append('<div class="landingCover"><div><img src=' + local.landingImg + ' class="landin"></div></div>');
            landingImg = true;
        }
        var $token = localStorage.token || '',
            url = $.trim(this.url),
            type = this.type.toUpperCase();
        for (var i = -1, arr = [];
            (i = url.indexOf("?", i + 1)) > -1; arr.push(i));
        if (type == 'GET') {
            if (arr != '') {
                var dataString = url.substring(arr).replace('?', '');
                var url = url.substring(0, arr);
            } else {
                var dataString = "";
            }
        } else {
            var dataString = decodeURI(this.data);
        }
        var $signUrl = hex_sha1(url),
            $dataString = dataString.replace(/=/g, '').split('&').sort().join(''),
            $startString = $dataString.substring(0, 3),
            $endString = $dataString.substring($dataString.length - 3),
            $sha1Text = $startString + $token + $endString + $signUrl,
            $sha1Sign = hex_sha1(utf16to8($sha1Text));
        xhr.setRequestHeader("X-Sign", $sha1Sign);
        xhr.setRequestHeader("X-Token", $token);
    },
    error: function (jqXHR, textStatus, errorMsg) {
        if (jqXHR.status == 401) {
            localStorage.clear();
            window.location.href = "/html/login.html";
        }
    }
});
/*添加时间戳*/
var timestamp = Date.parse(new Date());
$.each($("a[name='navtab']"), function () {
    var href = $(this).attr('href');
    $(this).attr('href', href + '?m=' + timestamp)
});
var hintCover = false;
$.extend({
    popupCover: function (opts) {
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
        }, option.showTime + 1000);
    }
});
