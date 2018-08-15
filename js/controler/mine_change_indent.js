var changeIndent = {
    initView: function () {
        this.getSelect();
        this.setIndent();
        XBack.init();
        XBack.listen(function () {
            alert("请设置身份！");
        });
    },
    getSelect: function () {
        var _this = this;
        $('.indentSelect>dl').on('click', function () {
            _this.indent = $(this).attr('id');
            $(this).addClass('onSelect').siblings('dl').removeClass('onSelect');
            $('.sureBtn').addClass('onSure');
        })
    },
    //提交
    setIndent: function () {
        var _this = this;
        $('.sureBtn').on('click', function () {
            if ($(this).hasClass('onSure')) {
                service.doAjaxRequest({
                    url: '/v1/users/identity',
                    type: 'POST',
                    data: {
                        "identity": _this.indent
                    }
                }, function () {
                    local.indent = _this.indent;
                    $.popupCover({
                        content: '设置成功！',
                        callback: function () {
                            if (localStorage.login_reffer) {
                                var reffer = localStorage.login_reffer;
                                localStorage.removeItem('login_reffer');
                                if (reffer.indexOf('?') >= 0) {
                                    window.location.href = reffer + '&fromLogin=1';
                                } else {
                                    window.location.href = reffer + '?fromLogin=1';
                                }
                            } else {
                                window.location.href = "/index.html"
                            }
                        }
                    })
                })
            }
        })
    }
};

$(function () {
    changeIndent.initView();
})
