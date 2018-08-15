var changeshenController = {
    initView: function () {
        var that = this;
        that.nameZ = /^[A-Za-z0-9-_\u4e00-\u9fa5]{3,20}$/;
        that.indent = localStorage.indent
        localFun.resizeFooter();
        this.initShowView();
        this.initEventView();
        this.checkIndent();
    },
    initShowView: function () {
        var that = this;
        //用户名和身份
        var USER_NAME = localStorage.username;
        $(".name input").val(USER_NAME);
    },
    initEventView: function () {
        var that = this;
        //左右按钮切换
        $(".right").on('click', function () {
            if (that.indent == 4) {
                that.indent = 1;
            } else {
                that.indent++;
            }
            that.checkIndent();
        });
        $(".left").on('click', function () {
            if (that.indent == 1) {
                that.indent = 4;
            } else {
                that.indent--;
            }
            that.checkIndent();
        });
        //提交按钮点击
        $("footer").on('click', function () {
            that.doSubmitView();
        });
    },
    //checkIndent
    checkIndent: function () {
        var that = this;
        switch (Number(that.indent)) {
            case 1:
                that.indentImg = '/img/indent2.png';
                that.indentName = '学生党';
                break;
            case 2:
                that.indentImg = '/img/indent1.png';
                that.indentName = '上班族';
                break;
            case 3:
                that.indentImg = '/img/indent3.png';
                that.indentName = '生意人';
                break;
            case 4:
                that.indentImg = '/img/indent4.png';
                that.indentName = '自由职业';
                that.ajaxIndent = 4;
                break;
        }
        $('.indentImg').attr('src', that.indentImg);
        $('.indentName').text(that.indentName);
    },
    //提交check功能
    doSubmitView: function () {
        var that = this;
        var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
        var $name = $(".name input"),
            emojireg = $name.val();
        emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
        $name.val(emojireg);
        if (emojireg == "") {
            $.popupCover({
                content: '亲，你的用户名叫什么?'
            })
            return false;
        } else {
            service.doAjaxRequest({
                url: '/v1/users/username',
                type: 'POST',
                data: {
                    "indent": that.indent,
                    "username": emojireg
                }
            }, function () {
                local.indent = that.indent;
                local.screenIdentIdx = that.indent;
                local.username = $name.val();
                $.popupCover({
                    content: '修改成功！',
                    callback: function () {
                        window.location.href = "/html/mine.html"
                    }
                })
            })
        }
    }
};
$(function () {
    changeshenController.initView();
});
