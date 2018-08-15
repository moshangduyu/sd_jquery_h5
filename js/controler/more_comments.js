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
        this.replyType = 0;
        this.bool = true;
        this.landing = false;
        this.paixu();
        this.doAjaxListView();
        this.doScrollView();
        this.doThumbsView();
        this.doThumbsReply();
        this.doReplyView();

    },
    //排序按钮
    paixu: function () {
        var _this = this;
        $('.show_paixu').click(function () {
            $('.selectBox').show();
        });
        $('.selectBox>div').on('click', function () {
            var idx = $(this).index();
            $('.selectBox>div').eq(idx).addClass('onSelect').siblings('div').removeClass('onSelect');
            $('.show_paixu').text($(this).text());
            _this.replyType = idx;
            _this.pageSize = 1;
            _this.bool = true;
            _this.landing = false;
            $('.selectBox').hide();
            _this.doAjaxListView();
        });
    },
    //评论内容展示
    doAjaxListView: function () {
        var _this = this;
        service.doAjaxRequest({
            type: "GET",
            url: "/v2/reply/replys",
            async: false,
            data: {
                "commentId": _this.commentId,
                "replyType": _this.replyType,
                "pageSize": _this.pageSize,
                "pageNum": '10'
            },

        }, function (b) {
            var contentHtml = "";
            var listHtml = "";
            $('header>b').text(b.reply_count + '条回复')
            contentHtml = "<div class='left'>";

            if (b.user_photo != '') {
                contentHtml += "<img src=" + b.user_photo + ">";
            } else {
                contentHtml += "<img src='../img/sudaidai.png'>";
            }
            contentHtml += "</div>" +
                "<div class='right'>" +
                "<div class='list-content-top'>";

            contentHtml += "<span> " + b.username + "</span> ";

            $('#reply').attr('placeholder', '回复：' + b.username);
            contentHtml += "<span class='product_xing star'><b>" + b.score + "</b><i></i><i></i><i></i><i></i><i></i></span><i>" + b.score + "</i>星</div > " +
                "<h6><span>" + b.create_date + "</span><span>" + b.result + "</span></h6>" +
                "<p class='ping' data-name=" + b.username + " data-id=''>" + b.content + "</p>" +
                "<div class='list-content-center'><label class='ping' data-name=" + b.username + " data-id=''></label>";
            if (b.is_useful == 1) {
                contentHtml += "<span class='thumbs onthumbs' data-useful=" + b.is_useful + "><i class='zanicon'></i><b>" + b.use_count + " </b></span> ";
            } else {
                contentHtml += "<span class='thumbs' data-useful=" + b.is_useful + "><i class='zanicon'></i><b>" + b.use_count + " </b></span>";
            }
            contentHtml += "</div></div>";
            $('.comment-list-content').html(contentHtml);
            localFun.star();
            $.each(b.replys.list, function (a, i) {
                listHtml += "<div>" +
                    "<dl>" +
                    "<dt>";
                if (i.user_photo != '') {
                    listHtml += "<img src=" + i.user_photo + ">";
                } else {
                    listHtml += "<img src='../img/sudaidai.png'>";
                }
                listHtml += "</dt>" +
                    "<dd>" +
                    "<h3>" + i.username + "</h3>" +
                    "<p>" + i.create_date + "</p>" +
                    "</dd>";
                if (i.is_useful == 1) {
                    listHtml += "<span class='thumbsReply onthumbs'  data-id=" + i.id + "><i class='zanicon'></i><b>" + i.use_count + "</b></span>";
                } else {
                    listHtml += "<span class='thumbsReply'  data-id=" + i.id + "><i class='zanicon'></i><b>" + i.use_count + "</b></span>";
                };
                listHtml += "</dl>";
                if (i.parent_username != '') {
                    listHtml += " <p class='replyContent' data-name=" + i.username + " data-id=" + i.id + ">回复：<span>" + i.parent_username + "</span>" + i.content + "</p>";
                } else {
                    listHtml += "<p class='replyContent' data-name=" + i.username + " data-id=" + i.id + ">" + i.content + "</p>";
                }
                listHtml += "</div>";
            });

            if (_this.landing) {
                $('.list-content-btm').append(listHtml);
            } else {
                $('.list-content-btm').html(listHtml);
            }
            _this.myScroll.refresh();
            _this.pageCode = b.replys.pageCount;
            _this.pageSize++;
        })
    },
    //分页加载
    doScrollView: function () {
        var _this = this;
        _this.myScroll.on('scroll', function () {
            var bottomHeight = this.y - this.maxScrollY;
            if (bottomHeight <= 100 && _this.bool) {
                _this.bool = false;
                if (_this.pageSize <= _this.pageCode) {
                    _this.landing = true;
                    AddCommentController.doAjaxListView();
                    _this.myScroll.refresh();
                } else {
                    $("#PullUp").html('已加载全部').show();
                    _this.myScroll.refresh();
                }
                _this.myScroll.on('scrollEnd', function () {
                    _this.bool = true;
                });
            }
        });
    },
    //回复操作
    doReplyView: function () {
        var _this = this;
        /*获取焦点*/
        $('#reply').focus(function () {
            $('footer').addClass('focusShow');
        })
        $(document).on('click', '.ping,.replyContent', function () {
            var name = $(this).data('name');
            _this.parentReplyId = $(this).data('id');
            $('#reply').focus().attr('placeholder', '回复：' + name);
            $('footer').addClass('focusShow');
        });

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
                //                $('#reply').attr('placeholder', '回复：' + _this.landlordName);
            };
        });
        /*评论发送按钮*/
        $('#send').click(function () {

            if ($(this).hasClass('sendBtn')) {
                var replycontent = $.trim($('.reply').val());
                service.doAjaxRequest({
                    url: '/v2/reply',
                    type: 'POST',
                    async: false,
                    data: {
                        "commentId": _this.commentId,
                        "content": replycontent,
                        "parentReplyId": _this.parentReplyId
                    },
                }, function () {
                    $.popupCover({
                        content: "回复成功",
                        callback: function () {
                            _this.pageSize = 1;
                            _this.replyType = 0;
                            _this.bool = true;
                            _this.landing = false;
                            _this.doAjaxListView();
                            $('.show_paixu').text('按时间');
                            $('.selectBox>div').eq(0).addClass('onSelect').siblings('div').removeClass('onSelect');
                            //                            window.location.reload();
                        }
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
    //楼主有用的点击效果
    doThumbsView: function () {
        var _this = this;
        $(".thumbs").click(function () {
            var that = $(this);
            var that_b = that.find('b');
            if (that.hasClass("onthumbs")) {
                var usefulType = "delete";
            } else {
                var usefulType = "post";
            }
            service.commentUseful(usefulType, {
                "commentId": _this.commentId
            }, function () {
                if (usefulType == "delete") {
                    that.removeClass("onthumbs");
                    if (that_b.text().indexOf('万') == -1) {
                        var num = Number(that_b.text());
                        that_b.text(num - 1)
                    }
                    $.popupCover({
                        "content": "取消点赞"
                    })
                } else if (usefulType == "post") {
                    that.addClass("onthumbs");
                    if (that_b.text().indexOf('万') == -1) {
                        var num = Number(that_b.text());
                        that_b.text(num + 1);
                    }

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
    },
    //回复点赞
    doThumbsReply: function () {
        var _this = this;
        $(document).on('click', '.thumbsReply', function () {
            var that = $(this);
            var that_b = that.find('b');
            var replyId = that.data('id');

            if (that.hasClass("onthumbs")) {
                var usefulType = "delete";
            } else {
                var usefulType = "post";
            }
            //            alert(that_b)
            //            alert(usefulType)
            service.commentUsefulReply(usefulType, {
                "replyId": replyId
            }, function () {
                if (usefulType == "delete") {
                    that.removeClass("onthumbs");
                    if (that_b.text().indexOf('万') == -1) {
                        var num = Number(that_b.text());
                        that_b.text(num - 1);
                    }
                    $.popupCover({
                        "content": "取消点赞"
                    })
                } else if (usefulType == "post") {
                    that.addClass("onthumbs");
                    if (that_b.text().indexOf('万') == -1) {
                        var num = Number(that_b.text());
                        that_b.text(num + 1);
                    }
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
