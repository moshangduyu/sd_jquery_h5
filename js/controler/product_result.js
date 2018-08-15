var productResultController = {
    initView: function () {
        //定义变量
        var that = this;
        that.myScroll = new IScroll('#wrapper', {
            probeType: 3,
            click: true,
            bounce: false,
            scrollbars: true,
            shrinkScrollbars: 'scale'
        });
        that.page = 1;
        that.resultId = 0;
        that.bool = false; // 拉动标记
        that.pageSize = "1";
        that.loading = false;
        that.productId = $.GetQueryString("productId");
        that.into = $.GetQueryString("into");
        that.fromLogin = $.GetQueryString("fromLogin");
        //方法调用
        this.initEventView();
        this.initBackView();
        this.initSwitchTabView(that.myScroll);
        this.initFixedNavView(that.myScroll);
        this.doCollectionView();
        this.initKefuView();
        this.changeHotListView();
        this.changeNewListView();
        this.doContentBtnView.initView();
    },
    initEventView: function () {
        var that = this;
        /*点击评论跳转*/
        $.LogonStatusEvent($(".addcommentIcon"), function () {
            window.location.href = "/html/product_result_addcomment.html?productId=" + that.productId
        }, function () {
            local.backHref = document.referrer;
            local.fromLogin = 1;
        });
    },
    //返回按钮
    initBackView: function () {
        var that = this;
        $(".back").click(function () {
            if (that.fromLogin == '1') {
                window.location = localStorage.backHref
            } else {
                javascript: history.back(-1);
            }
        });
    },
    //tab点击切换ajax渲染
    initSwitchTabView: function (myScroll) {
        var that = this;
        $(".center_nav>li,.fixed_tab>li").on("click", function () {
            var idx = $(this).index();
            $(".center_nav>li").eq(idx).addClass("navOnClick").siblings().removeClass("navOnClick");
            $(".fixed_tab>li").eq(idx).addClass("navOnClick").siblings().removeClass("navOnClick");
            switch (idx) {
                case 0:
                    $(".details_btm").show().siblings("div").hide();
                    break;
                case 1:
                    $(".evaluate").show().siblings("div").hide();
                    that.doPageingLoadView(myScroll);
                    break;
            }
            myScroll.refresh();
            if ($(this).hasClass('fixed_li')) {
                $('.fixed_tab').hide();
                myScroll.scrollToElement(center_nav, 500);
            }
        });
    },

    //悬浮切换按钮
    initFixedNavView: function (myScroll) {
        myScroll.on('scroll', function () {
            var top = $("#wrapper").offset().top;
            var scrollTop = $('.center_nav').offset().top - top;
            if (scrollTop <= 0) {
                $('.fixed_tab').show();
            } else {
                $('.fixed_tab').hide();
            }
        })
    },
    //客服
    initKefuView: function () {
        $.LogonStatusEvent($(".pr_kf"), function () {
            window.location.href = 'http://kefu.easemob.com/webim/im.html?tenantId=34128&to=kefuchannelimid_041115&appKey=1164170103115772%23kefuchannelapp34128&xmppServer=im-api.easemob.com&restServer=a1.easemob.com';
        }, function () {
            local.backHref = document.referrer;
            local.fromLogin = 1;
        })
    },
    //利率计算器
    doAjaxRequestSuccessView: function (obj) {
        var time_min = parseInt(obj.period_min),
            time_max = parseInt(obj.period_max),
            max_money = parseInt(obj.loan_max),
            min_money = parseInt(obj.loan_min);
        var interest_alg = obj.interest_alg_num,
            pay_method = obj.pay_method;
        //显示利率计算
        $(".rate dt").text(obj.interest_alg);
        $(".rate dd").text(obj.interest_rate + "%");
        if (pay_method == 1) {
            $(".Interest dt").text("一次性还款(元)");
        } else if (pay_method == 2) {
            $(".Interest dt").text("每期利息(元)");
        }
        if (obj.avg_quota >= 10000) {
            $(".quota dd").text(obj.avg_quota / 10000 + "万")
        } else {
            $(".quota dd").text(obj.avg_quota)
        }
        //金额、期限展示
        if (max_money >= 10000) {
            var max_money = max_money / 10000 + "万"
        }
        if (min_money >= 10000) {
            var min_money = min_money / 10000 + "万"
        }
        var money = min_money + "~" + max_money + "元";
        //期限显示
        function time() {
            if (interest_alg == 1) {
                var min_time = Number(time_min / 30).toFixed(1).replace(".0", "");
                var max_time = Number(time_max / 30).toFixed(1).replace(".0", "");
                $(".select_time").find("b").text(min_time + "~" + max_time + "个月")
            } else if (interest_alg == 2) {
                $(".select_time").find("b").text(time_min + "~" + time_max + "天")
            }
        }
        time();
        //select选择
        var option1 = '';
        $.each(obj.loan_money, function (a, i) {
            option1 += '<option>' + i + '</option>';
        });
        $("#select_money").append(option1);
        var option2 = '';
        $.each(obj.loan_term, function (a, i) {
            option2 += '<option>' + i + '</option>';
        });
        $("#select_time").append(option2);
        //有存储的筛选金额判断显示
        if (localStorage.screenMoney) {
            var screenMoney = localStorage.screenMoney;
            if (screenMoney >= parseInt(obj.loan_min) && screenMoney <= parseInt(obj.loan_max)) {
                $(".select_money").find("b").text(localStorage.screenShowMoney).css({
                    "color": "#2b95f2"
                });;
            } else {
                $(".select_money").find("b").text(money).css({
                    "color": "#2b95f2"
                });;
            }
        } else { //无存储的筛选金额判断显示
            $(".select_money").find("b").text(money);
        }
        //请选金额&&期限判断
        showJudge()

        function showJudge() {
            //金额计算
            var moneyChan = $(".select_money").find("b").text();
            var moneys = moneyChan.replace("元", "").replace("万", "0000");
            var lilu = obj.interest_rate / 100;
            if (pay_method == 1) {
                if ($(".select_money").find("b").text().indexOf("~") != -1 && $(".select_time").find("b").text().indexOf("~") != -1) {
                    $(".Interest dd").text("请选金额/期限")
                } else if ($(".select_money").find("b").text().indexOf("~") != -1) {
                    $(".Interest dd").text("请选金额")
                } else if ($(".select_time").find("b").text().indexOf("~") != -1) {
                    $(".Interest dd").text("请选期限")
                }
                //金额计算
                if ($(".select_money").find("b").text().indexOf("~") == -1 && $(".select_time").find("b").text().indexOf("~") == -1) {
                    var showTime = $(".select_time").find("b").text();
                    if (showTime.indexOf("天") != -1) {
                        var changetime = showTime.replace("天", "")
                    } else if (showTime.indexOf("个月") != -1) {
                        var changetime = showTime.replace("个月", "") * 30
                    } else if (showTime.indexOf("年") != -1) {
                        var changetime = parseInt(showTime.replace("年", "") * 360)
                    };
                    if (interest_alg == 1) {
                        var timeIs = changetime / 30;
                        var moneyIs = Number(moneys * lilu * timeIs).toFixed(2);
                        $(".Interest dd").text(moneyIs)
                    } else if (interest_alg == 2) {
                        var moneyIs = Number(moneys * lilu * changetime).toFixed(2);
                        $(".Interest dd").text(moneyIs)
                    }
                }
            }
            if (pay_method == 2) {
                if ($(".select_money").find("b").text().indexOf("~") != -1) {
                    $(".Interest dd").text("请选金额")
                }
                if ($(".select_money").find("b").text().indexOf("~") == -1) {
                    //金额计算
                    var moneyIs = Number(moneys * lilu).toFixed(2);;
                    $(".Interest dd").text(moneyIs)
                }
            }
        }
        //选择计算利率
        $(".details_select select").change(function () {
            $(this).next("b").text($(this).find("option:selected").text());
            $(this).parent('label').addClass('selectOn');
            showJudge()
        })
    },
    //详情下架展示
    doAjaxRequestErrorView: function () {
        $('.container').html('<div class="promptCenter">该产品详情页打开错误,</br><em>3&nbsp;s</em> 后自动返回上一页...</div>');
        $('.promptCenter').css({
            "position": "absolute",
            "top": 40 + "%",
            "left": 50 + "%",
            "-webkit-transform": "translate(-50%,-50%)",
            "font-size": .26 + "rem",
            "text-align": "center",
            "line-height": .5 + "rem"
        });
        $('.promptCenter>em').css({
            "font-size": .3 + "rem",
            "color": "red"
        });
        setTimeout(function () {
            window.location.href = "/html/product.html"
        }, 3000)
    },
    //详情渲染Top
    doProductDetailView: function (obj) {
        var myScroll = this.myScroll;
        $(".one_show").hide();
        if (obj.comment_count != 0) {
            $('.evaluateNum').html('(' + obj.comment_count + ')');
        }
        var html = "";
        $('.head_title').text(obj.platform_product_name); //标题
        html += "<div class='details_one' data-id=" + obj.platform_product_id + ">" + "<div><img src=" + obj.product_logo + "></div>" + "<h3 class='productName'>" + obj.platform_product_name + "</h3>" + "<b class='platformName' style='display:none' data-id=" + obj.platform_id + ">" + obj.platform_name + "</b>" + "<p class='p1' style='height:.55rem'>";
        $.each(obj.tag_name, function (x, y) {
            html += "<span style='color:#" + y.font_color + ";background:#" + y.bg_color + ";border-color:#" + y.boder_color + "' >" + y.name + "</span>";
        });
        html += " </p>" + "</div>" + "<div class='details_two' style='position:relative;top:-.1rem'><p>" + " <span>产品人气：</span>" + "<i data-wih=" + obj.success_width + " class='bgShow'>" + "<b>" + obj.success_num + "</b>" + "</i>" + " <b>" + obj.success_count + "人申请</b></p>" + " <p>" + " <span>放款速度：</span>" + " <i data-wih=" + obj.fast_width + " class='bgShow'>" + "<b>" + obj.fast_num + "</b>" + "</i>" + " <b>平均" + obj.fast_speed + "小时</b><span class='tishi'></span></p>" + "<p>" + " <span>下款概率：</span>" + " <i data-wih=" + obj.pass_width + " class='bgShow'>" + "<b>" + obj.pass_num + "</b>" + "</i>" + " <b>通过率" + obj.pass_rate + "</b>" + "</p>" + "</div>";
        if (obj.banner_img != "") {
            html += "<div class='details_three' style='margin-top:0;margin-bottom:.1rem'><img src=" + obj.banner_img + "></div>";
        }
        $(".details").append(html);
        myScroll.refresh();
        //判断收藏显示样式
        if (obj.sign == 1) {
            $(".product_result_shoucang").addClass("shoucangClick")
        } else {
            $(".product_result_shoucang").removeClass("shoucangClick")
        }
        //显示图片点击
        $(".details_three").on("click", function () {
            productResultController.doApplyJumpView();
        });

        /*touch图*/
        var swiper = new Swiper('.details_liu', {
            slidesPerView: 4,
            spaceBetween: 15,
            freeMode: true
        });
        //判断显示条背景显示
        $.each($(".bgShow"), function () {
            var bgCenter = $(this).find("b").text();
            switch (bgCenter) {
                case '凑合':
                    $(this).css({
                        "background": "url('../img/couhuo@2x.png') no-repeat",
                        "background-size": '.3rem 100%'
                    });
                    break;
                case '普通':
                    $(this).css({
                        "background": "url('../img/putong@2x.png') no-repeat",
                        "background-size": '.6rem 100%'
                    });
                    break;
                case '较好':
                    $(this).css({
                        "background": "url('../img/jiaohao@2x.png') no-repeat",
                        "background-size": '.9rem 100%'
                    });
                    break;
                case '良好':
                    $(this).css({
                        "background": "url('../img/lianghao@2x.png') no-repeat",
                        "background-size": '1.2rem 100%'
                    });
                    break;
                case '优秀':
                    $(this).css({
                        "background": "url('../img/youxiu@2x.png') no-repeat",
                        "background-size": '1.5rem 100%'
                    });
                    break;
                case '爆款!':
                    $(this).css({
                        "background": "url('../img/baokuan@2x.png') no-repeat",
                        "background-size": '2.08rem 100%'
                    });
                    $(this).find("b").css({
                        "color": "white"
                    });
                    break;
            }
        })
        //判断是否有攻略跳转
        if (obj.news_link != "") {
            $(".pr_gl").addClass("haveShow");
            $(".pr_gl").click(function () {
                window.location.href = obj.news_link;
            })
        }
        myScroll.refresh();
        $('.tishi').click(function () {
            $.popupCover({
                content: "基于速贷之家千万借款用户真实评论生成!"
            });
        });
        productResultController.doWxView();
    },
    //详情渲染btm-left
    doProductParticularView: function (obj) {
        var myScroll = this.myScroll;
        var details_html = "";
        details_html += "<div class='details_four' style='margin-top:0'>" + "<h3 class='h3_top'>申请条件&要点</h3>" + "<p style='font-size:.26rem;border-bottom:.1rem white solid'>" + obj.apply_condition + "</p>" + "</div>" + "<div class='details_five'>" + "<h3 class='h3_top'>流程&材料</h3>" + "<div class='details_liu swiper-container'>" + "<div class='liu_box swiper-wrapper'>";
        $.each(obj.process, function (i, b) {
            details_html += "<div class='swiper-slide' data-id=" + b.id + ">" + "<dl>" + "<dt><img src=" + b.img + "></dt>" + "<dd>" + b.name + "</dd>" + "</dl>" + "<span></span>" + "</div>"
        })
        details_html += "</div>" + "</div>" + "</div>" + "<div class='details_six'>" + "<h3 class='h3_top'>借款审核细节</h3>" + "<div class='borrowing_details'>";
        $.each(obj.loan_detail, function (x, y) {
            details_html += "<div><span>" + y.title + ":</span><span>" + y.content + "</span></div>";
        })
        details_html += "</div>" + "</div>" + "<div class='details_eight'>" + "<h3 class='h3_top'>新手指导</h3>" + "<p>" + obj.guide + "</p>" + "</div>" + "<div class='details_seven'>" + "<h3 class='h3_top'>产品优势</h3>" + "<p>" + obj.product_introduct + "</p>" + "</div>";
        $(".details_btm").append(details_html);
        myScroll.refresh();
    },
    //产品星星展示
    doCommentScoreView: function (obj) {
        var that = this;
        var html1 = "",
            html2 = "";
        html1 += "<div class='evaluate_two'>" + "<p class='prc_zhdf'>产品综合满意度 <span>(" + obj.score + "分)</span></p><div class='product_daxing star'><b>" + obj.score + "</b><i></i><i></i><i></i><i></i><i></i></div></div>";
        $(".evaluate_three").before(html1);
        localFun.star();

        $.each(obj.result_list, function (i, b) {
            html2 += '<span data-id=' + b.result_id + '>' + b.result_name + '<b>';
            if (Number(b.result_count) > 0) {
                html2 += '(' + b.result_count + ')';
            }
            html2 += '</b></span>';
        });
        $('.evaluate_apartNumbox').html(html2);
        $('.evaluate_apartNumbox>span').eq(0).addClass('onapartNumbox');
        that.myScroll.refresh()

        /*评论列表切换显示*/
        $('.evaluate_apartNumbox>span').click(function () {
            if ($(this).hasClass('onapartNumbox')) {
                return false;
            } else {
                $(this).addClass('onapartNumbox').siblings('span').removeClass('onapartNumbox');
                that.resultId = $(this).data('id');
                that.loading = false;
                that.pageSize = "1";
                that.changeHotListView();
                that.changeNewListView();
            }
            that.myScroll.refresh();
            if ($('.center_nav').offset().top > 0) {
                $('.fixed_tab').hide();
            }
        });
    },
    //最热评论
    doHotListView: function (obj) {
        var that = this;
        var html = "";
        $.each(obj.list, function (i, b) {
            html += "<div class='comment-list-content " + b.platform_comment_id + "' data-id=" + b.platform_comment_id + " data-name=" + b.username + ">" +
                "<div class='left'>";
            if (b.user_photo != '') {
                html += "<img src=" + b.user_photo + ">";
            } else {
                html += "<img src='../img/sudaidai.png'>";
            }
            html += "</div>" +
                "<div class='right'>" +
                "<div class='list-content-top'><span> " + b.username + "</span><span class='product_xing star'><b>" + b.score + "</b><i></i><i></i><i></i><i></i><i></i></span><i>" + b.score + "</i>星</div > " +
                "<h6><span>" + b.create_date + "</span><span>" + b.result + "</span></h6>" +
                "<p id='landlord_content'>" + b.content + "</p>" +
                "<div class='list-content-center'><label class='ping'></label> <span class='thumbs' data-useful=" + b.is_useful + "><i class='zanicon'></i><b>" + b.use_count + " </b></span></div>";
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
            html += "</div>";
            html += "<h5 class='line'> </h5>" +
                "</div>" +
                "</div>";
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
        that.myScroll.refresh();
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
    //最新评论
    doNewListView: function (obj) {
        var that = this;
        var html = "";
        $.each(obj.list, function (i, b) {
            html += "<div class='comment-list-content " + b.platform_comment_id + "' data-id=" + b.platform_comment_id + " data-name=" + b.username + ">" +
                "<div class='left'>";
            if (b.user_photo != '') {
                html += "<img src=" + b.user_photo + ">";
            } else {
                html += "<img src='../img/sudaidai.png'>";
            }
            html += "</div>" +
                "<div class='right'>" +
                "<div class='list-content-top'><span> " + b.username + "</span><span class='product_xing star'><b>" + b.score + "</b><i></i><i></i><i></i><i></i><i></i></span><i>" + b.score + "</i>星</div > " +
                "<h6><span>" + b.create_date + "</span><span>" + b.result + "</span></h6>" +
                "<p id='landlord_content'>" + b.content + "</p>" +
                "<div class='list-content-center'><label class='ping'> </label> <span class='thumbs' data-useful=" + b.is_useful + "><i class='zanicon'></i><b>" + b.use_count + " </b></span></div>";
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
            html += "</div>";
            html += "<h5 class='line'> </h5>" +
                "</div>" +
                "</div>";
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
            $("#PullUp").html('已加载全部');
        }
        that.myScroll.refresh();
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
    //收藏按钮
    doCollectionView: function () {
        var that = this;
        $.LogonStatusEvent($(".product_result_shoucang"), function () {
            $this = $(".product_result_shoucang");
            if ($this.hasClass("shoucangClick")) {
                $this.removeClass("shoucangClick");
                var collectionType = "delete";
            } else {
                $this.addClass("shoucangClick");
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
            local.backHref = document.referrer;
            local.fromLogin = 1;
            window.location.href = "/html/login.html"
        });
    },
    //立即申请
    doApplyJumpView: function () {
        var that = this;
        if (localStorage.userId) {
            //登录跳转页面
            service.doAjaxRequest({
                url: '/v1/oauth/application',
                type: 'GET',
                data: {
                    "type": 4,
                    "platformId": $(".platformName").data("id"),
                    "productId": that.productId
                }
            }, function (json) {
                var productName = $(".productName").text();
                var href = json.url;
                cnzz_TrackEvent('wap', '申请产品跳转', productName, '');
                //                service.doAjaxRequest({
                //                    url: '/v1/data/apply/log',
                //                    type: 'POST',
                //                    data: {
                //                        "productId": that.productId
                //                    }
                //                }, function () {
                window.location.href = href;
                //                }, function (json) {
                //                    $.popupCover({
                //                        content: json.error_message
                //                    })
                //                })
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
            local.backHref = document.referrer;
            local.fromLogin = 1;
            window.location.href = "/html/login.html"
        }
    },
    //分页加载
    doPageingLoadView: function (myScroll) {
        var that = this,
            _that = that.doPageingLoadView;
        var bool = true;
        myScroll.on('scroll', function () {
            var bottomHeight = this.y - this.maxScrollY;
            if (bottomHeight <= 200 && _that.bool) {
                _that.bool = false;
                if (that.pageSize <= that.pageCode) {
                    that.loading = 'true';
                    setTimeout(function () {
                        that.changeNewListView();
                    }, 300)
                } else {
                    $("#PullUp").html('已加载全部');
                    myScroll.refresh();
                }
            }

        });
        myScroll.on('scrollEnd', function () {
            _that.bool = true;
        });
    },
    //列表按钮点击交互
    doContentBtnView: {
        initView: function () {
            this.doThumbsView();
            this.doReplyVierw();
            this.doMoreReplyVierw();
        },
        //点赞按钮
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
        },
        //评论回复
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
            $('#wrapper,header').click(function (e) {
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
        //查看更多回复按钮
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
            });
        }
    },
    //自定义微信分享
    doWxView: function () {
        var url = location.href.split("#")[0];

        $.ajax({
            type: "post",
            url: api_sudaizhijia_host + "/v1/wechat",
            dataType: "json",
            data: {
                url: url
            },
            beforeSend: function () {},
            success: function (json) {
                weixin(json.data);
            },
            error: function () {}
        });
        var _title = $(".productName").text() + "-速贷之家",
            _desc = '全网速审,实战攻略,免息红包,上速贷之家!',
            _link = window.location.href,
            _imgUrl = m_sudaizhijia_host + '/img/sudai_logo.png';

        function weixin(json) {
            wx.config({
                debug: false,
                appId: json.appId,
                timestamp: json.timestamp,
                nonceStr: json.nonceStr,
                signature: json.signature,
                jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"]
            });
            wx.ready(function () {
                //分享给好友
                wx.onMenuShareAppMessage({
                    title: _title,
                    desc: _desc,
                    link: _link,
                    imgUrl: _imgUrl,
                    type: 'link',
                    dataUrl: '',
                    success: function () {},
                    cancel: function () {}
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: _title,
                    //                    desc: _desc,
                    link: _link,
                    imgUrl: _imgUrl,
                    success: function () {},
                    cancel: function () {}
                });
                wx.error(function (res) {});
            });
        }

    }
};

$(function () {

    productResultController.initView();

    /*利率计算器*/
    service.doAjaxRequest({
        url: '/v2/product/calculator',
        type: 'GET',
        data: {
            "productId": productResultController.productId
        }
    }, function (json) {
        productResultController.doAjaxRequestSuccessView(json);
    }, function () {
        productResultController.doAjaxRequestErrorView();
    });

    /*详情渲染Top*/
    service.doAjaxRequest({
        url: '/v2/product/detail',
        type: 'GET',
        data: {
            "productId": productResultController.productId
        }
    }, function (json) {
        productResultController.doProductDetailView(json);
    });

    /*详情渲染btm-left*/
    service.doAjaxRequest({
        url: '/v2/product/particular',
        type: 'GET',
        data: {
            "productId": productResultController.productId
        }
    }, function (json) {
        productResultController.doProductParticularView(json);
    });

    //产品星星展示
    service.doAjaxRequest({
        url: '/v3/comment/score',
        type: 'GET',
        data: {
            "productId": productResultController.productId
        }
    }, function (json) {
        productResultController.doCommentScoreView(json);
    });

    //立即申请点击
    $('.jiekuan').click(function () {
        productResultController.doApplyJumpView();
    })

});
