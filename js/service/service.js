var store = {
    localStorage: function () {
        var localStorageSupported = ("localStorage" in window);
        if (!localStorageSupported) {
            if (confirm('不支持HTML5 localStorage, 请使用现代浏览器')) {
                window.location.href = "http://event.sudaizhijia.com/m/appdownload/index.html"
            }
        } else {
            local = window.localStorage;
            if (typeof localStorage === 'object') {
                try {
                    localStorage.setItem('localStorage', 1);
                    localStorage.removeItem('localStorage');
                } catch (e) {
                    alert("该网站不支持无痕浏览，请关闭无痕模式!");
                };
            };
        }
    }
};
$(function () {
    store.localStorage();
});
var cookie = {
    getPlatFrom: function () {
        var sudai_plat_fr = $.GetQueryString("sd_plat_fr");
        if (sudai_plat_fr) {
            $.cookie('sd_plat_fr', sudai_plat_fr, {
                expires: 1,
                path: '/'
            });
        };
        return $.cookie('sd_plat_fr') || '';
    }
};
/*----设置AJAX的全局默认选项----*/
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
var address = {
    FAVOURITE_NEWSCOLLECTION: api_sudaizhijia_host + '/v1/favourite/newscollection', //活动咨询-关注
    FAVOURITE_COLLECTION: api_sudaizhijia_host + '/v1/favourite/collection', //产品详情-关注
    COMMENT_USEFUL: api_sudaizhijia_host + '/v1/comment/useful', //产品详情&更多评论-有用
    CLUB_BIND: api_sudaizhijia_host + '/v1/club/bind', //论坛
    WECHAT_SHARE: api_sudaizhijia_host + '/v1/wechat', //微信分享
    GEETES_CAPTCHA: api_sudaizhijia_host + '/v1/geetes/captcha', //极验一次验证
};

var service = {
    doAjaxRequest: function (data, success, error) {
        var url = data['url'];
        var type = data['type'];
        var resetAsync = data['async'];
        delete data['url'];
        delete data['type'];
        delete data['async'];
        error = error || $.noop;
        $.ajax({
            url: api_sudaizhijia_host + url,
            type: type,
            async: (resetAsync === false) ? false : true,
            timeout: 1000 * 30,
            data: data.data,
            dataType: "json",
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    success(json.data);
                } else {
                    error(json);
                }
            }
        });
    },
    //极验一次验证
    geetesCaptcha: function (data, success) {
        $.ajax({
            url: address.GEETES_CAPTCHA,
            type: 'GET',
            dataType: 'json',
            data: data,
            beforeSend: function () {},
            success: function (json) {
                success(json);
            }
        });
    },

    //微信分享
    wechatShare: function (data, success) {
        $.ajax({
            url: address.WECHAT_SHARE,
            type: 'POST',
            dataType: 'json',
            data: data,
            beforeSend: function () {},
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    success(json.data);
                }
            }
        });
    },
    //活动咨询-详情
    favouriteNewscollection: function (type, data, success, error) {
        $.ajax({
            url: address.FAVOURITE_NEWSCOLLECTION,
            type: type,
            dataType: 'json',
            data: data,
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    success(json);
                } else {
                    error();
                }
            }
        });
    },
    //产品详情-关注
    favouriteCollection: function (type, data, success, error) {
        $.ajax({
            url: address.FAVOURITE_COLLECTION,
            type: type,
            dataType: 'json',
            data: data,
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    success(json);
                } else {
                    error();
                }
            }
        });
    },

    //产品详情&更多评论-有用
    commentUseful: function (type, data, success, error) {
        $.ajax({
            url: address.COMMENT_USEFUL,
            type: type,
            dataType: 'json',
            data: data,
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    success(json);
                } else {
                    error(json);
                }
            }
        });
    },
    //论坛
    getClub: function (data, success, error) {
        $.ajax({
            url: address.CLUB_BIND,
            type: 'POST',
            dataType: "json",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Token", localStorage.token || '');
            },
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    success(json);
                } else {
                    error();
                }
            }
        });
    }
};
