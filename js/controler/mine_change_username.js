var changeUsername = {
    initView: function () {
        this.source = $.GetQueryString('source');
        this.initShowView();
        this.checkName();
    },
    initShowView: function () {
        $('#userName').attr('placeholder', localStorage.username)
    },
    //判断字符串长度
    strlen: function (str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1   
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            } else {
                len += 2;
            }
        }
        return len;
    },
    //输入正则判断
    checkName: function () {
        var _this = this;
        $('#submit').on('click', function () {
            var userName = $('#userName').val();
            var one = userName.substr(0, 1),
                two = userName.substr(0, 2),
                numZ = /^[0-9]*$/;
            if (userName == '') {
                $.popupCover({
                    content: '请输入用户名'
                });
                return false;
            } else if (numZ.test(one)) {
                $.popupCover({
                    content: '用户名不能以数字开头'
                });
                return false;
            } else if (two.toLowerCase() == 'sd'.toLowerCase()) {
                $.popupCover({
                    content: '用户名已存在'
                });
                return false;
            } else if (_this.strlen(userName) > 16) {
                $.popupCover({
                    content: '用户名过长'
                });
                return false;
            } else if (!/^[-A-Za-z0-9\u4e00-\u9fa5]{0,20}$/.test(userName)) {
                $.popupCover({
                    content: '用户名不能包含特殊字符'
                });
            } else {
                service.doAjaxRequest({
                    url: '/v3/users/username',
                    type: 'POST',
                    data: {
                        username: userName
                    }
                }, function () {
                    local.username = userName;
                    $.popupCover({
                        content: '提交成功',
                        callback: function () {
                            if (_this.source == 1) {
                                window.location.href = "/html/mine.html";
                            } else if (_this.source == 2) {
                                window.location.href = "/html/earn_integral.html";
                            }
                        }
                    })
                }, function (obj) {
                    $.popupCover({
                        content: obj.error_message,
                        callback: function () {
                            $('#userName').focus();
                        }
                    })
                })
            }
        })
    }
}
$(function () {
    changeUsername.initView();
})
