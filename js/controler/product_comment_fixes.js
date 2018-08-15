var productCommentController = {
    initView: function () {
        this.productId = $.GetQueryString("productId");
        this.page = 1;
        this.resultId = 0;
        this.pageSize = "1";
        this.loading = false;
        this.initEventView();
        this.getScore();
        this.changeHotListView();
        this.changeNewListView();
        this.scroll();
        this.doReplyVierw();
        this.doMoreReplyVierw();
        this.doThumbsView();
    },
    initEventView: function () {
        var _this = this;
        /*back按钮*/
        $('.backBtn').on('click', function () {
            window.location.href = "product_result_fixes.html?productId=" + _this.productId
        });
        /*添加评论*/
        $('.addcommentIcon').on('click', function () {
            window.location.href = "/html/product_result_addcomment.html?productId=" + _this.productId
        });
        /*评论列表切换显示*/
        $('.evaluate_apartNumbox').on('click', 'span', function () {
            if ($(this).hasClass('onapartNumbox')) {
                return false;
            } else {
                $(this).addClass('onapartNumbox').siblings('span').removeClass('onapartNumbox');
                _this.resultId = $(this).data('id');
                _this.loading = false;
                _this.pageSize = "1";
                _this.changeHotListView();
                _this.changeNewListView();
            }
        });
    },
    /*获取选项标签*/
    getScore: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v3/comment/score',
            type: 'GET',
            data: {
                "productId": _this.productId
            }
        }, function (obj) {
            var html = '';
            $.each(obj.result_list, function (i, b) {
                html += '<span data-id=' + b.result_id + '>' + b.result_name + '<b>';
                if (Number(b.result_count) > 0) {
                    html += '(' + b.result_count + ')';
                }
                html += '</b></span>';
            });
            $('.evaluate_apartNumbox').html(html);
            $('.evaluate_apartNumbox>span').eq(0).addClass('onapartNumbox');
        });
    },
    /*最热评论*/
    doHotListView: function (obj) {
        var that = this;
        var html = "";
        $.each(obj.list, function (i, b) {
            html += "<div class='comment-list-content " + b.platform_comment_id + "' data-id=" + b.platform_comment_id + " data-name=" + b.username + ">" + "<div class='left'>";
            if (b.user_photo != '') {
                html += "<img src=" + b.user_photo + ">";
            } else {
                html += "<img src='../img/sudaidai.png'>";
            }
            html += "</div>" + "<div class='right'>" + "<div class='list-content-top'><span> " + b.username + "</span><span>" + b.create_date + "</span></div><h6><span>" + b.result + "</span><span class='product_xing star'><b>" + b.score + "</b><i></i><i></i><i></i><i></i><i></i></span><i>" + b.score + "</i>星</h6>" + "<p id='landlord_content'>" + b.content + "</p>" + "<div class='list-content-center'><span class='ping'><i></i><b>评论</b></span> <span class='thumbs' data-useful=" + b.is_useful + "><i class='zanicon'></i><b>" + b.use_count + " </b></span></div>";
            html += "<div class='list-content-btm seeMore' data-id=" + b.platform_comment_id + ">";
            $.each(b.replys, function (a, i) {
                if (i.parent_username != '') {
                    html += "<p><span data-id=" + i.id + ">" + i.username + "</span>回复<span>" + i.parent_username + "：</span>" + i.content + "</p>";
                } else {
                    html += "<p><span data-id=" + i.id + ">" + i.username + "：</span>" + i.content + "</p>";
                }
            })
            if (b.replys_sign == 1) {
                html += "<div> 查看更多> </div>";
            }
            html += "</div></div></div>";
        });
        $('.hot-comment-title').show();
        $('.hot-comment-list').html(html);
        $.each($('.list-content-btm'), function () {
            if ($(this).find('p').length <= 0) {
                $(this).hide();
            }
        });
        localFun.star();
        $.each($('.thumbs'), function () {
            var useful = $(this).data('useful');
            if (useful == 1) {
                $(this).addClass('onthumbs');
            }
        });
    },
    changeHotListView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v4/comment/hots',
            type: 'GET',
            data: {
                "productId": that.productId,
                "resultId": that.resultId,
                "pageSize": that.pageSize
            }
        }, function (json) {
            that.doHotListView(json);
        }, function () {
            $('.hot-comment-list').html('');
            $('.hot-comment-title').hide();
        })
    },
    /*最新评论*/
    doNewListView: function (obj) {
        var that = this;
        var html = "";
        $.each(obj.list, function (i, b) {
            html += "<div class='comment-list-content " + b.platform_comment_id + "' data-id=" + b.platform_comment_id + " data-name=" + b.username + ">" + "<div class='left'>";
            if (b.user_photo != '') {
                html += "<img src=" + b.user_photo + ">";
            } else {
                html += "<img src='../img/sudaidai.png'>";
            }
            html += "</div>" + "<div class='right'>" + "<div class='list-content-top'><span> " + b.username + "</span><span>" + b.create_date + "</span></div><h6><span>" + b.result + "</span><span class='product_xing star'><b>" + b.score + "</b><i></i><i></i><i></i><i></i><i></i></span><i>" + b.score + "</i>星</h6>" + "<p id='landlord_content'>" + b.content + "</p>" + "<div class='list-content-center'><span class='ping'><i></i><b>评论</b></span> <span class='thumbs' data-useful=" + b.is_useful + "><i class='zanicon'></i><b>" + b.use_count + " </b></span></div>";
            html += "<div class='list-content-btm seeMore' data-id=" + b.platform_comment_id + ">";
            $.each(b.replys, function (a, i) {
                if (i.parent_username != '') {
                    html += "<p><span data-id=" + i.id + ">" + i.username + "</span>回复<span>" + i.parent_username + "：</span>" + i.content + "</p>";
                } else {
                    html += "<p><span data-id=" + i.id + ">" + i.username + "：</span>" + i.content + "</p>";
                }
            })
            if (b.replys_sign == 1) {
                html += "<div> 查看更多> </div>";
            }
            html += "</div></div></div>";
        });
        $('.new-comment-title').show();
        if (that.loading) {
            $(".new-comment-list").append(html);
        } else {
            $(".new-comment-list").html(html);
        };
        $.each($('.list-content-btm'), function () {
            if ($(this).find('p').length <= 0) {
                $(this).hide();
            }
        });
        localFun.star();
        $.each($('.thumbs'), function () {
            var useful = $(this).data('useful');
            if (useful == 1) {
                $(this).addClass('onthumbs');
            }
        });
        that.pageCode = obj.pageCount;
        that.pageSize++;
        if (that.pageCode > 1) {
            $("#PullUp").html('努力加载中...');
        } else {
            $("#PullUp").html('已加载全部评论');
        }
    },
    changeNewListView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v4/comment/comments',
            type: 'GET',
            data: {
                "productId": that.productId,
                "resultId": that.resultId,
                "pageSize": that.pageSize
            }
        }, function (json) {
            that.doNewListView(json);
        }, function () {
            $(".new-comment-list").html('');
            $('.new-comment-title').hide();
            $('#PullUp').html('');
            that.pageCode = 0;
        })
    },
    /*上拉加载*/
    scroll: function () {　　　
        var _this = this;
        //监听滚动
        $(window).scroll(function () {　 //判断滚动到底部
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_this.pageSize <= _this.pageCode) {
                    _this.loading = true;
                    _this.changeNewListView();
                } else {
                    $('#PullUp').html('已加载全部评论');
                }
            }
        });
    },
    /*评论回复*/
    doReplyVierw: function () {
        /*评论点击回复*/
        $(document).on('click', '.ping,#landlord_content', function () {
            if (localStorage.userId) {
                commentId = $(this).parents('.comment-list-content').data('id');
                var name = $(this).parents('.comment-list-content').data('name');
                $('.replyBox').show();
                $('#reply').focus().attr('placeholder', '回复：' + name);
            } else {
                local.login_reffer = window.location.href;
                local.backHref = document.referrer;
                local.fromLogin = 1;
                window.location.href = "/html/login.html"
            }
        });
        $('.evaluate_three,header').click(function (e) {
            if (e.target.className != "ping") {
                $('#reply').val('');
                $('#reply').blur();
                $('.replyBox').hide();
                $('#send').removeClass('sendBtn').css({
                    "color": "#737272"
                });
                $('.numLen').hide().text("");
            };
        });
        $('#reply').bind('input', function () {
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
        //点击发送
        $(document).on('click', '#send', function () {
            var replycontent = $.trim($('#reply').val());
            if ($(this).hasClass('sendBtn')) {
                service.doAjaxRequest({
                    url: '/v2/reply',
                    type: 'POST',
                    data: {
                        "commentId": commentId,
                        "content": replycontent,
                        "parentReplyId": ''
                    }
                }, function () {
                    $.popupCover({
                        content: "回复成功"
                    });
                    $('.replyBox').hide();
                    $('#reply').val('');
                    $('#send').removeClass('sendBtn').css({
                        "color": "#737272"
                    });
                    $('.numLen').hide().text("");
                    var username = localStorage.username;
                    $.each($('.' + commentId), function () {
                        $(this).find('.list-content-btm').show();
                        $(this).find('.list-content-btm').prepend('<p><span><b>' + username + '</b>：</span>' + replycontent + '</p>');
                        $(this).find('.list-content-btm>p').eq(5).hide();
                    })
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                })
            }
        });
    },
    /*查看更多回复按钮*/
    doMoreReplyVierw: function () {
        $(document).on('click', '.seeMore', function () {
            if (localStorage.userId) {
                var commentId = $(this).data('id');
                window.location.href = "/html/more_comments.html?commentId=" + commentId;
            } else {
                local.login_reffer = window.location.href;
                local.backHref = document.referrer;
                local.fromLogin = 1;
                window.location.href = "/html/login.html"
            }
        })
    },
    /*点赞按钮*/
    doThumbsView: function () {
        var that = this;
        $(document).on('click', ".thumbs", function () {
            var _that = $(this);
            if (localStorage.userId) {
                var commentId = $(this).parents(".comment-list-content").data("id");
                var $changeThumbs = $("." + commentId).find('.thumbs');
                var num = $(this).find("b").text();
                if ($(this).hasClass("onthumbs")) {
                    $changeThumbs.removeClass("onthumbs");
                    if (num.indexOf('万') == -1) {
                        var num = Number(num) - 1;
                    }
                    var usefulType = "delete";
                } else {
                    if (num.indexOf('万') == -1) {
                        var num = Number(num) + 1;
                    }
                    $changeThumbs.addClass("onthumbs");
                    var usefulType = "post";
                }
                $changeThumbs.find('b').text(num);
                service.commentUseful(usefulType, {
                    "commentId": commentId
                }, function () {
                    if (usefulType === "delete") {
                        $.popupCover({
                            "content": "取消点赞"
                        })
                    } else if (usefulType === "post") {
                        $.popupCover({
                            "content": "点赞成功"
                        })
                    }
                }, function (json) {
                    $.popupCover({
                        "content": json.error_message
                    })
                });
            } else {
                local.login_reffer = window.location.href;
                local.backHref = document.referrer;
                local.fromLogin = 1;
                window.location.href = "/html/login.html"
            }
        });
    }
};
$(function () {
    productCommentController.initView();
});
