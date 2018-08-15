var mineApplyController = {
    initView: function () {
        var that = this;
        that.loading = false;
        that.pageSize = 1;
        that.idx = 0;
        this.initEventView();
        this.doProductsListView();
        this.handleScroll();
        this.doApplyJumpView();
    },
    initEventView: function () {
        var that = this;
        /*tab切换*/
        $(".mcm_tab>div").click(function () {
            var idx = that.idx = $(this).index();
            $(this).find("span").addClass("onclick");
            $(this).siblings().find("span").removeClass("onclick");
            that.pageSize = 1;
            that.loading = false;

            if (idx == 0) {
                $(".mcm_tab_content").html('');
                $('#PullUp').show().html('<img src="../img/rolling.svg" alt="">努力加载中');
                that.doProductsListView();
            } else if (idx == 1) {
                $('#PullUp').hide();
                that.doConsultationView();
            }
        });
        //催审按钮
        $(document).on('click', '.trial', function () {
            var _that = $(this);
            var productId = $(this).data('id');
            if ($(this).hasClass('trialOrder')) {
                $.popupCover({
                    content: '已为您加速审核，请保持电话畅通~'
                });
            } else {
                if (confirm('催审一次将花５积分，是否催审？')) {
                    if (localStorage.userScore < 5) {
                        $.popupCover({
                            content: '抱歉，积分不足，无法提交催审~'
                        });
                    } else {

                        //催审接口
                        service.doAjaxRequest({
                            url: '/v1/credit/urge',
                            type: 'POST',
                            data: {
                                urgeId: productId
                            }
                        }, function (obj) {
                            $.popupCover({
                                content: '已为您加速审核~',
                                callback: function () {
                                    _that.addClass('trialOrder').text('已催审');
                                }
                            })
                        }, function (obj) {
                            $.popupCover({
                                content: obj.error_message
                            })
                        })
                    }
                }
            }


        });
    },
    //贷款数据展示
    doProductsListView: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/product/historys',
            type: 'GET',
            data: {
                "pageNum": 10,
                "pageSize": _this.pageSize
            }
        }, function (obj) {
            var html = "";
            $.each(obj.list, function (i, b) {
                html += "<div class='apply_list' data-id=" + b.platform_product_id + ">" +
                    "<dl class='res_top'>" +
                    " <dt><img src=" + b.product_logo + "></dt>" +
                    "<dd>" +
                    "<h3>" + b.platform_product_name + "</h3>" +
                    "<p>金额：<span>" + b.loan_money + "</span>期限：<span>" + b.period_time + "</span></p>" +
                    "</dd>" +
                    "<span class='time'>" + b.created_at + "</span>" +
                    " </dl>" +
                    "<div class='res_btm'>";
                if (b.is_comment == 0) {
                    html += "<a href='product_result_addcomment.html?productId=" + b.platform_product_id + "'><span class='evaluate ping'>评论</span></a>";
                } else if (b.is_comment == 1) {
                    html += "<a href='product_result_addcomment.html?productId=" + b.platform_product_id + "'><span class='evaluate'>修改评价</span></a>";
                }
                if (b.is_urge == 1) {
                    html += "<span class='trial trialOrder'>已催审</span>";

                } else {
                    html += "<span class='trial' data-id=" + b.id + ">催审</span>";
                }
                html += "<span class='speed' data-product=" + b.platform_product_id + "  data-platform=" + b.platform_id + ">进度查询</span>";
                if (b.service_mobile != '') {
                    html += "<a href='tel:" + b.service_mobile + "'><span class='service'>客服电话</span></a>";
                }
                html += "</div>" +
                    "</div>";
            })
            if (_this.loading) {
                $(".mcm_tab_content").append(html);

            } else {
                $(".mcm_tab_content").html(html);
            }
            _this.pageCode = obj.pageCount;
            _this.pageSize++;
            if (obj.pageCount == 1) {
                $('#PullUp').hide();
            };

        }, function (json) {
            _this.doNoCollectView(json, 'product');
        })
    },
    //信用卡数据展示
    doConsultationView: function () {
        var that = this;
        service.doAjaxRequest({
            url: '/v1/banks/progress',
            type: 'GET'
        }, function (obj) {
            var html = "";
            $.each(obj, function (i, b) {
                html +=
                    '<dl class="ka_list">' +
                    '<a href=' + b.process_link + '>' +
                    '<dt><img src=' + b.bank_logo + '></dt>' +
                    '<dd>' + b.bank_short_name + '</dd>' +
                    '</a>' +
                    '</dl>';
            })
            $(".mcm_tab_content").html(html);

        }, function (json) {
            that.doNoCollectView(json, 'banks');
        })
    },
    //暂未申请默认显示
    doNoCollectView: function (json, data) {
        if (json.error_code == 1500 || json.error_code == 500) {
            if (data == 'product') {
                var htmls = "<div class='noshou'>" + "<img src='../img/no_products_icon.png' alt=''>" + "<p>暂无贷款申请记录<br><a href='product.html'>立即去申请>></a></p>" + "</div>";

            } else if (data == 'banks') {
                var htmls = "<div class='noshou'>" + "<img src='../img/no_products_icon.png' alt=''>" + "<p>暂无信用卡申请记录</p>" + "</div>";
            }
            $(".mcm_tab_content").html(htmls);
            $('#PullUp').hide();
        }
    },
    //scroll事件-上啦加载
    handleScroll: function () {　　　
        var _this = this;
        //监听滚动
        $(window).scroll(function () {　 //判断滚动到底部
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_this.pageSize <= _this.pageCode) {

                    _this.loading = true;
                    setTimeout(function () {
                        if (_this.idx == 0) {
                            _this.doProductsListView();
                        }
                    }, 300)
                } else {
                    $('#PullUp').html('已加载全部产品');
                }
            }
        });
    },
    //进度查询
    doApplyJumpView: function () {
        $(document).on('click', '.speed', function () {
            var platformId = $(this).data('platform');
            var productId = $(this).data('product');
            if (localStorage.userId) {
                //登录跳转页面
                service.doAjaxRequest({
                    url: '/v1/oauth/application',
                    type: 'GET',
                    data: {
                        "type": 4,
                        "platformId": platformId,
                        "productId": productId
                    }
                }, function (json) {
                    var productName = $(".productName").text();
                    var href = json.url;
                    cnzz_TrackEvent('wap', '申请产品跳转', productName, '');
                    //                    service.doAjaxRequest({
                    //                        url: '/v1/data/apply/log',
                    //                        type: 'POST',
                    //                        data: {
                    //                            "productId": productId
                    //                        }
                    //                    }, function () {
                    window.location.href = href;
                    //                    }, function (json) {
                    //                        $.popupCover({
                    //                            content: json.error_message
                    //                        })
                    //                    })
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                })
            } else {
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        });
    }
};
$(function () {
    mineApplyController.initView();
});
