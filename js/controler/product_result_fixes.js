var productResultController = {
    initView: function () {
        this.productId = $.GetQueryString("productId");
        this.CirclesWidth = $(document.body).outerWidth() * 0.08;
        this.initEventView();
        this.detail();
    },
    initEventView: function () {
        var _this = this;
        //费用详情伸拉效果
        $('.detail_btn').on('click', function () {
            $(this).toggleClass('up')
            $('.calculator_bottom_content').slideToggle(200);
        });
        //立即申请点击
        $('footer').click(function () {
            productResultController.doApplyJumpView();
        });
        //点击查看全部回复
        $(document).on('click', '.landlord_content', function () {
            if ($(this).hasClass('hide')) {
                $(this).removeClass('hide');
            } else {
                $(this).addClass('hide');
            }
        });
    },
    /*顶部select选项*/
    selectChange: function () {
        var _this = this;
        $(".calculator_top select").change(function () {
            var optionVal = $(this).find("option:selected").text();
            var showVal = parseInt(optionVal);
            if ($(this).hasClass('quotaSection')) {
                //额度
                _this.useQuota = optionVal.replace("元", "");
            } else {
                //期限
                $('.termUnit').text(optionVal.replace(/[^\u4e00-\u9fa5]/gi, "").replace('个', ''));
                var showVal = parseInt(optionVal);
                if (optionVal.indexOf("天") != -1) {
                    _this.useTime = optionVal.replace("天", "")
                } else
                if (optionVal.indexOf("个月") != -1) {
                    _this.useTime = optionVal.replace("个月", "") * 30
                } else if (optionVal.indexOf("年") != -1) {
                    _this.useTime = parseInt(optionVal.replace("年", "") * 360)
                };
            }
            $(this).next("input").val(showVal);
            _this.calculator();
        });
    },
    /*圆形进度*/
    progressBar: function (Id, Value, Text) {
        var _this = this;
        var myCircle = Circles.create({
            id: Id,
            radius: _this.CirclesWidth,
            value: Value,
            maxValue: 100,
            width: 4,
            text: Text,
            colors: ['#d7d7d7', '#4c86f5'],
            duration: 400,
            wrpClass: 'circles-wrp',
            textClass: 'circles-text',
            valueStrokeClass: 'circles-valueStroke',
            maxValueStrokeClass: 'circles-maxValueStroke',
            styleWrapper: true,
            styleText: true
        });
    },
    /*详情内容*/
    detail: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v3/products/detail',
            type: 'GET',
            data: {
                productId: this.productId
            }
        }, function (json) {
            _this.platformId = json.platform_id;
            //标题
            $('.header_title').text(json.platform_product_name);
            //收藏
            if (json.sign == 1) {
                $('.product_result_sign').addClass('onSign');
            };
            //金额&期限默认值显示
            $('#quotaInput').attr('placeholder', parseInt(json.loan_max));
            $('#termInpnt').attr('placeholder', parseInt(json.period_max));
            $('.termUnit').text(json.period_max.replace(/[^\u4e00-\u9fa5]/gi, "").replace('个', ''));
            //金额下拉判断显示
            if (json.quota_sign == 1) {
                var html = '';
                $.each(json.quota, function (i, b) {
                    html += '<option value="">' + b + '</option>';
                });
                $('.quotaSection').addClass('show').append(html);
            };
            //时间term
            var term_html = '';
            $.each(json.term, function (i, b) {
                term_html += '<option value="">' + b + '</option>';
            });
            $('.termSection').addClass('show').append(term_html);
            _this.selectChange();
            //金额输入范围判断
            inputRange();

            function inputRange() {
                var loan_min = parseInt(json.loan_min);
                var loan_max = parseInt(json.loan_max);
                $('#quotaInput').blur(function () {
                    var Val = $(this).val();
                    if (Val < loan_min) {
                        $(this).val(loan_min);
                    } else if (Val > loan_max) {
                        $(this).val(loan_max);
                    };
                    _this.useQuota = $(this).val();
                    _this.calculator();
                });
            };
            $('.calculator_center').html('<div>额度 ' + json.loan_money + '</div><div>期限 ' + json.loan_period + '</div>');
            //圆形进度条数据
            _this.progressBar('circles-1', json.success_width, json.success_count);
            _this.progressBar('circles-2', json.fast_width, json.fast_speed);
            _this.progressBar('circles-3', json.avg_quota_width, json.avg_quota);
            _this.progressBar('circles-4', json.pass_width, json.pass_rate);
            //审批条件&信用贴士
            label();

            function label() {
                var html1 = '';
                $.each(json.condition_tags, function (i, b) {
                    html1 += '<span style="color:#' + b.font_color + ';border-color:#' + b.boder_color + ';background-color:#' + b.bg_color + '">' + b.name + '</span>';
                });
                $('#condition_tags').html(html1);
                var html2 = '';
                $.each(json.tips_tags, function (i, b) {
                    html2 += '<span style="color:#' + b.font_color + ';border-color:#' + b.boder_color + ';background-color:#' + b.bg_color + '">' + b.name + '</span>';
                });
                $('#tips_tags').html(html2);
            };
            //更多信息
            loan_detail();

            function loan_detail() {
                var html = '';
                $.each(json.loan_detail, function (i, b) {
                    html += '<li>' + b.title + '：<span>' + b.content + '</span></li>';
                });
                $('#loan_detail').html(html);
                //下款秘籍
                if (json.news_link != '') {
                    $('.cheats').attr('href', json.news_link).show();
                }
            };
            _this.calculator();
            _this.doCollectionView();
        });
        service.doAjaxRequest({
            url: '/v3/products/particular',
            type: 'GET',
            data: {
                productId: _this.productId,
                pageSize: 1,
                pageNum: 2
            }
        }, function (json) {
            //评论
            if (json.counts == 0) {
                $('#moreComment').html('<a>抢沙发</a>').addClass('noList');
            }
            $('.scoreNum').text(json.score);
            $('.scoreText').text(json.score + '星');
            $('#countsAll').text(json.counts);
            var comment_html = '';
            $.each(json.comment_list, function (i, b) {
                comment_html += '<div class="comment-list"><div class = "left"><img src=' + b.user_photo + '></div><div class="right"><div class="list-content-top"><span>' + b.username + '</span><span>' + b.create_date + '</span></div><h6><span>' + b.result + '</span><span class="product_xing star"><b>' + b.score + '</b><i></i><i></i><i></i><i></i><i></i></span><i>' + b.score + '</i>星</h6><p class="landlord_content hide">' + b.content + '</p></div></div>';
            });
            $('.comment-list-box').html(comment_html);
            localFun.star();
            _this.moreComment();
            //产品推荐
            var product_html = '';
            $.each(json.like_list, function (i, b) {
                product_html += '<a href="product_result_fixes.html?productId=' + b.platform_product_id + '"><div class="product_list"><dl><dt><img src=' + b.product_logo + '></dt><dd><h3>' + b.platform_product_name + '';
                if (b.tag_name != '') {
                    product_html += '<span class="bubble">' + b.tag_name + '</span>';
                }
                product_html += '</h3><p>' + b.product_introduct + '</p></dd><span>' + b.success_count + '人今日申请</span></dl><div class="product_list_btm"><div class="product_list_btm_left"><p>' + b.quota + '</p><p>额度</p></div><div class="product_list_btm_center"><p>' + b.term + '</p><p>期限</p></div><div class="product_list_btm_right"> <span>申请</span></div></div></div></a>';
            });
            $('.product_list_box').html(product_html);
        });
    },
    /*计算器*/
    calculator: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v3/products/calculator',
            type: 'GET',
            data: {
                productId: _this.productId,
                loanMoney: _this.useQuota || $('#quotaInput').prop('placeholder'),
                loanTimes: _this.useTime || $('#termInpnt').prop('placeholder')
            }
        }, function (json) {
            var cost_html = '';
            $.each(json.cost, function (i, b) {
                cost_html += '<p>' + b.name + ' <span >' + b.value + '</span></p>';
            });
            $('.cost_box').html(cost_html);
            var total_html = '';
            $.each(json.total, function (i, b) {
                total_html += '<p>' + b.name + '<span>' + b.value + '</span></p>';
            });
            $('.total_box').html(total_html).append('<p>注：以上计算结果仅供参考，以实际下款情况为准。</p>');
        });
    },
    /*收藏按钮*/
    doCollectionView: function () {
        var that = this;
        $.LogonStatusEvent($(".product_result_sign"), function () {
            $this = $(".product_result_sign");
            if ($this.hasClass("onSign")) {
                $this.removeClass("onSign");
                var collectionType = "delete";
            } else {
                $this.addClass("onSign");
                var collectionType = "post";
            }
            service.favouriteCollection(collectionType, {
                "productId": that.productId
            }, function () {
                if (collectionType === "delete") {
                    $.popupCover({
                        "content": "取消关注"
                    })
                } else if (collectionType === "post") {
                    $.popupCover({
                        "content": "关注成功"
                    })
                }
            }, function (json) {
                $.popupCover({
                    "content": json.error_message
                })
            })
        }, function () {
            local.login_reffer = window.location.href;
            //            local.backHref = document.referrer;
            //            local.fromLogin = 1;
            window.location.href = "/html/login.html"
        });
    },
    /*立即申请*/
    doApplyJumpView: function () {
        var that = this;
        if (localStorage.userId) {
            //登录跳转页面
            service.doAjaxRequest({
                url: '/v1/oauth/application',
                type: 'GET',
                data: {
                    "type": 4,
                    "platformId": that.platformId,
                    "productId": that.productId
                }
            }, function (json) {
                var productName = $(".productName").text();
                var href = json.url;
                cnzz_TrackEvent('wap', '申请产品跳转', productName, '');
                window.location.href = href;
            }, function (json) {
                $.popupCover({
                    content: json.error_message
                })
            })
            /*积分产品申请接口*/
            service.doAjaxRequest({
                url: '/v1/credit/apply',
                type: 'POST',
                data: {
                    "productId": that.productId
                }
            }, $.noop)
        } else {
            local.login_reffer = window.location.href;
            //            local.backHref = document.referrer;
            //            local.fromLogin = 1;
            window.location.href = "/html/login.html"
        }
    },
    /*更多评论*/
    moreComment: function () {
        var _this = this;
        $.LogonStatusEvent($("#moreComment"), function () {
            if ($("#moreComment").hasClass('noList')) {
                window.location.href = "/html/product_result_addcomment.html?productId=" + _this.productId
            } else {
                window.location.href = "/html/product_comment_fixes.html?productId=" + _this.productId
            }
        }, function () {
            local.login_reffer = window.location.href;
            window.location.href = "/html/login.html"
        });
    }
};
$(function () {
    productResultController.initView();
});
