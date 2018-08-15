var AddCommentController = {
    initView: function () {
        this.myScroll = new IScroll('#wrapper', {
            probeType: 3,
            scrollbars: true,
            click: true,
            shrinkScrollbars: 'scale'
        });
        /*截取地址栏传入评论ID*/
        this.commentId = $.GetQueryString("commentId");
        this.pageSize = 1;
        this.bool = true;
        this.landing = false;
        this.doAjaxListView();
        this.doScrollView();
        this.doReplyView();

    },
    //评论内容展示
    doAjaxListView: function () {
        var _that = this;
        service.doAjaxRequest({
            type: "GET",
            url: "/v1/reply/replys",
            async: false,
            data: {
                "commentId": _that.commentId,
                "pageSize": _that.pageSize,
                "pageNum": '10'
            },

        }, function (b) {
            var contentHtml = "";
            var listHtml = "";
            contentHtml = "<div class='list-content-top'><span>" + b.username + "</span>&nbsp;&nbsp;<span class='product_xing'><b>" + b.score + "</b><i></i><i></i><i></i><i></i><i></i></span><i>" + b.score + "</i>星</div><div class='list-content-center'><span>" + b.create_date + "</span><label class='ping' for='reply'>" + b.reply_count + "</label><span class='thumbs'><i class='zanicon'></i><b>" + b.use_count + "</b></span></div><h6>" + b.result + "</h6><p>" + b.content + "</p></div>";
            $('.comment-list-content').html(contentHtml);
            localFun.starSmall();
            if (b.is_useful == 1) {
                $('.thumbs').addClass('onthumbs');
            }
            $.each(b.replys.list, function (a, i) {
                listHtml += "<p><span><b>" + i.username + "</b>回复：</span>" + i.content + "</p>";
            });
            _that.doThumbsView();
            if (_that.landing) {
                $('.list-content-btm').append(listHtml);
            } else {
                $('.list-content-btm').html(listHtml);
            }
            _that.pageCode = b.replys.pageCount;
            _that.pageSize++;
        })
    },
    //分页加载
    doScrollView: function () {
        var _that = this;
        _that.myScroll.on('scroll', function () {
            var bottomHeight = this.y - this.maxScrollY;
            if (bottomHeight <= 100 && _that.bool) {
                _that.bool = false;
                if (_that.pageSize <= _that.pageCode) {
                    _that.landing = true;
                    AddCommentController.doAjaxListView();
                    _that.myScroll.refresh();
                } else {
                    $("#PullUp").html('已加载全部').show();
                    _that.myScroll.refresh();
                }
                _that.myScroll.on('scrollEnd', function () {
                    _that.bool = true;
                });
            }
        });
    },
    //回复操作
    doReplyView: function () {
        var _that = this;
        /*获取焦点*/
        $('#reply').focus(function () {
            $('footer').addClass('focusShow');
        })
        /*评论输入检测*/
        $('#reply').bind('input', function () {
            var replylen = $(this).val().length;
            var replylen = $.trim($(this).val()).length;
            if (replylen > 0 && replylen <= 140) {
                $('#send').addClass('sendBtn');
                $('.numLen').hide();
                $('#send').css({
                    "color": "#44b7f7"
                })
            } else if (replylen > 140) {
                $('#send').removeClass('sendBtn');
                $('#send').css({
                    "color": "#fd3838"
                })
                var numlen = replylen - 140;
                $('.numLen').show().text("-" + numlen);
            } else {
                $('#send').removeClass('sendBtn');
                $('.numLen').hide();
                $('#send').css({
                    "color": "#737272"
                })
            }
        });
        $('#wrapper').click(function (e) {
            if (e.target.className != "ping") {
                $('#reply').blur();
                $('#reply').val('');
                $('#send').removeClass('sendBtn').css({
                    "color": "#737272"
                });
                $('.numLen').hide().text("");
                $('footer').removeClass('focusShow');
            };
        });
        /*评论发送按钮*/
        $('#send').click(function () {

            if ($(this).hasClass('sendBtn')) {
                var replycontent = $('.reply').val();
                service.doAjaxRequest({
                    url: '/v1/reply',
                    type: 'POST',
                    async: false,
                    data: {
                        "commentId": _that.commentId,
                        "content": replycontent
                    },
                }, function () {
                    var username = localStorage.username;
                    $('.list-content-btm').prepend('<p><span><b>' + username + '</b>回复：</span>' + replycontent + '</p>');
                    var textNum = $('.ping').text();
                    textNum++;
                    $('.ping').text(textNum);
                    $.popupCover({
                        content: "回复成功！"
                    });
                    $('.reply').val('');
                    $('#send').removeClass('sendBtn').css({
                        "color": "#737272"
                    });
                    $('.numLen').hide().text("");
                    $('footer').removeClass('focusShow');
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
            }
        });
    },
    //有用的点击效果
    doThumbsView: function () {
        var _that = this;
        $(".thumbs").click(function () {
            if ($(this).hasClass("onthumbs")) {
                var usefulType = "delete";
            } else {
                var usefulType = "post";
            }
            service.commentUseful(usefulType, {
                "commentId": _that.commentId
            }, function () {
                if (usefulType == "delete") {
                    $(".thumbs").removeClass("onthumbs");
                    var num = Number($(".thumbs b").text()) - 1;
                    $(".thumbs b").text(num)
                    $.popupCover({
                        "content": "取消点赞"
                    })
                } else if (usefulType == "post") {
                    $(".thumbs").addClass("onthumbs");
                    var num = Number($(".thumbs b").text()) + 1;
                    $(".thumbs b").text(num);
                    $.popupCover({
                        "content": "点赞成功"
                    })
                }
            }, function (json) {
                $.popupCover({
                    "content": json.error_message
                })
            });
        });
    }
};
$(function () {
    AddCommentController.initView();
});
