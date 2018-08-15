var productController = {
    initView: function () {
        this.myScroll = new IScroll('#wrapper', {
            probeType: 3
            , scrollbars: true
            , click: true
            , shrinkScrollbars: "clip"
        });
        this.$topSpan = $('.product_head_btm>span');
        this.$btmBtn = $('.cover_btm_box>li');
        this.$moneyBtn = $('.moneyCover>ul>li');　
        /*获取筛选存储的筛选条件*/
        this.SmoneyIdx = localStorage.screenMoneyIdx || ''; //筛选金额下标
        this.SsortIdx = localStorage.screenSortIdx || '1'; //排序下标
        this.Smoney = localStorage.screenMoney || ''; //筛选额度
        //筛选身份ID
        if (localStorage.screenIdentIdx) {
            this.SidentIdx = localStorage.screenIdentIdx;
        }
        else {
            this.SidentIdx = localStorage.indent || '0';
        }
        //筛选我有
        if (localStorage.screenHaveIdx) {
            this.ShaveIdx = JSON.parse(localStorage.screenHaveIdx);
            if (this.ShaveIdx.length == 0) {
                this.ShaveIdx = '';
            }
        }
        else {
            this.ShaveIdx = '';
        };
        //筛选我需要
        if (localStorage.screenNeedIdx) {
            this.SneedIdx = JSON.parse(localStorage.screenNeedIdx);
            if (this.SneedIdx.length == 0) {
                this.SneedIdx = '';
            }
        }
        else {
            this.SneedIdx = '';
        };
        this.pageSize = 1;
        this.loading = 'false';
        localFun.doFixedNav(); //悬浮导航栏
        localFun.downloadCover(0); //底部下载弹窗
        this.initLocationView();
        this.doProductsListView();
        this.pageingLoad.scrollStart(this.myScroll);
        this.initBaseView();
        this.apply();
        this.androidDownload();
    }
    , /*base64解密landing32授权登录*/
    initBaseView: function () {
        var oneloan_login = $.GetQueryString('oneloan_login');
        if (oneloan_login) {
            var result_local = JSON.parse(decodeURIComponent(oneloan_login));
            local.userId = result_local.sd_user_id;
            local.indent = result_local.indent;
            local.username = result_local.username;
            local.phone = result_local.mobile;
            local.sex = result_local.sex;
            local.name = result_local.realname;
            local.token = result_local.accessToken;
        };
    }, //判断是否存在定位城市
    initLocationView: function () {
        var that = this;
        if (localStorage.cityLocation) {
            $('.cityLocation').text(localStorage.cityLocation);
        }
        else {
            that.doLocationCity();
        }
    }, //上次定位城市
    doLocationCity: function () {
        service.doAjaxRequest({
            url: '/v1/location/city'
            , type: 'GET'
            , data: {
                "deviceId": $.cookie('sd_equipment_id')
            }
        }, function (obj) {
            $('.cityLocation').text(obj.user_city);
            localStorage.cityId = obj.area_id;
        })
    }, //获取筛选标签
    doSearchtagView: function (json) {
        var haveSpan = ''
            , needSpan = '';
        $.each(json.loan_has_lists, function (i, b) {
            haveSpan += '<span id=' + b.id + '>' + b.value + '</span>';
        });
        $('.have').html(haveSpan);
        $.each(json.loan_need_lists, function (i, b) {
            needSpan += '<span id=' + b.id + '>' + b.value + '</span>';
        });
        $('.need').html(needSpan);
        this.screen.init(this);
    }, //筛选＆显示产品列表
    doProductsListView: function () {
        var that = this;
        if (localStorage.screenHaveIdx) {
            var ShaveIdx = JSON.parse(localStorage.screenHaveIdx).join(',');
        }
        else {
            var ShaveIdx = '';
        };
        if (localStorage.screenNeedIdx) {
            var SneedIdx = JSON.parse(localStorage.screenNeedIdx).join(',');
        }
        else {
            var SneedIdx = '';
        };
        //        console.log(that.SidentIdx + '|' + that.Smoney + '|' + ShaveIdx + '|' + SneedIdx + '|' + that.SsortIdx + '|' + that.pageSize + '|' + $.cookie('sd_equipment_id'));
        service.doAjaxRequest({
            url: '/v3/products'
            , type: 'GET'
            , async: false
            , data: {
                "productType": that.SsortIdx
                , "indent": that.SidentIdx
                , "loanMoney": that.Smoney
                , "pageSize": that.pageSize
                , "pageNum": 10
                , "loanNeed": SneedIdx
                , "loanHas": ShaveIdx || ''
                , "areaId": localStorage.cityId
                , "deviceId": $.cookie('sd_equipment_id')
                , "terminalType": '3'
            }
        }, function (json) {
            var product_html = "";
            $.each(json.list, function (i, b) {
                product_html += '<div class="product_list apply"  data-platformId=' + b.platform_id + '  data-productId=' + b.platform_product_id + '  data-growing-container="true" data-growing-title=' + b.platform_product_name + '><dl><dt><img src=' + b.product_logo + '></dt><dd><h3>' + b.platform_product_name + '';
                if (b.tag_name != '') {
                    product_html += '<span class="bubble">' + b.tag_name + '</span>';
                }
                product_html += '</h3><p>' + b.product_introduct + '</p></dd><span>' + b.success_count + '人今日申请</span></dl><div class="product_list_btm"><div class="product_list_btm_left"><p>' + b.quota + '</p><p>额度</p></div><div class="product_list_btm_center"><p>放款速度：' + b.loan_speed + '</p><p>利率：' + b.interest_rate + '</p></div><div class="product_list_btm_right"> <span>申请</span></div></div></div>';
            });
            $('.productsTopIcon').show();
            if (that.loading == 'true') {
                $("#productList").append(product_html);
            }
            else {
                $("#productList").html(product_html);
            };
            that.pageCode = json.pageCount;
            that.pageSize++;
            that.myScroll.refresh();
            if (that.pageCode > 1) {
                $("#PullUp").html('努力加载中...').removeClass('noMore');
            }
            else {
                $("#PullUp").html('更多新品，敬请期待').addClass('noMore');
            };
            /*产品详情跳转*/
            bindProductDetail();

            function bindProductDetail() {
                $(".produc_touch_results").off('click').on("click", function () {
                    var chanpinid = $(this).data('type')
                    window.location.href = "/html/product_result.html?productId=" + chanpinid
                })
            }
        }, function (json) {
            $("#PullUp").hide();
            var html3 = "<div class='no_result'>" + "<img src='../img/%E5%8C%B9%E9%85%8D%E7%BB%93%E6%9E%9C%E6%97%A0%E6%95%B0%E6%8D%AE.png' alt=''>" + "<p>啊哦,没有与您匹配的产品</p>" + "</div>";
            $("#productList").html(html3);
            that.myScroll.refresh();
            that.loading = 'false';
            that.pageCode = 0;
            that.pageSize = 1;
        })
    }, //立即申请点击按钮
    apply: function () {
        $(document).on('click', '.apply', function () {
            var platformId = $(this).attr('data-platformId')
                , productId = $(this).attr('data-productId');
            service.doAjaxRequest({
                url: '/v1/oauth/application'
                , type: 'GET'
                , data: {
                    "type": 4
                    , "platformId": platformId
                    , "productId": productId
                }
            }, function (json) {
                var href = json.url;
                window.location.href = href;
            }, function (json) {
                $.popupCover({
                    content: json.error_message
                })
            })
        })
    }, //上啦加载&下拉刷新
    pageingLoad: {
        bool: true
        , finished: true
        , scrollStart: function (myScroll) {
            myScroll.on('scrollStart', function () {
                startY = myScroll.y
            });
            this.scroll(myScroll);
        }
        , scroll: function (myScroll) {
            var _that = this;
            myScroll.on('scroll', function () {
                //上啦加载
                var bottomHeight = this.y - this.maxScrollY;
                if (bottomHeight <= 200 && _that.bool) {
                    _that.bool = false;
                    if (productController.pageSize <= productController.pageCode) {
                        productController.loading = 'true';
                        setTimeout(function () {
                            productController.doProductsListView();
                        }, 300)
                    }
                    else {
                        $("#PullUp").html('更多新品，敬请期待').addClass('noMore');
                        myScroll.refresh();
                    }
                }
                //下拉刷新
                var scrollY = -myScroll.y
                if (_that.finished && scrollY < -40 && startY == 0) {
                    _that.finished = false;
                    $('#pullDown-msg').text('松开刷新');
                    $('#PullDown').css({
                        "position": "static"
                    });
                    myScroll.scrollToElement(PullDown, 0);
                    $('#wrapper').on('touchend', function () {
                        window.location.reload();
                    });
                }
            });
            _that.scrollEnd(myScroll);
        }
        , scrollEnd: function (myScroll) {
            var _that = this;
            myScroll.on('scrollEnd', function () {
                _that.bool = true;
            });
        }
    }, //筛选条件
    screen: {
        //初始化显示
        init: function (that) {
            //顶部额度
            that.$moneyBtn.eq(that.SmoneyIdx).addClass('moneyCoverClick');
            $('.money>em').text(localStorage.screenShowMoney);
            //顶部身份
            $('.indentBox').find("#indent" + that.SidentIdx).addClass('loanTypeCoverClick');
            //顶部我有
            if (localStorage.screenHaveIdx) {
                $.each(that.ShaveIdx, function (i, b) {
                    $('#' + b + '').addClass('loanTypeCoverClick');
                });
            }
            //顶部我需要
            if (localStorage.screenNeedIdx) {
                $.each(that.SneedIdx, function (i, b) {
                    $('#' + b + '').addClass('loanTypeCoverClick');
                });
            }
            /*底部排序筛选*/
            $('#sort' + that.SsortIdx).addClass('cover_btm_click');
            this.coverAction(that);
        }
        , coverAction: function (that) {
            that.$topSpan.on('click', function () {
                var idx = $(this).index();
                if ($(this).hasClass('topClick')) {
                    $(this).removeClass('topClick');
                    $('.cover_top').hide();
                }
                else {
                    $(this).addClass('topClick').siblings('span').removeClass('topClick');
                    $('.cover_top').show();
                    var coverH2 = $('.moneyCover').height()
                        , coverH3 = $('.loanTypeCover').height();
                    $('.moneyCover').css({
                        "top": -coverH2
                    });
                    $('.loanTypeCover').css({
                        "top": -coverH3
                    });
                    $('.cover_top>div').eq(idx).animate({
                        "top": 0
                    });
                }
                /*隐藏cover*/
                $('.loanTypeCover').on('click', function (e) {
                    e.stopPropagation();
                });
                $('.cover_top').on('click', function () {
                    $(this).hide();
                    that.$topSpan.removeClass('topClick');
                })
            });
            /*------底部排序弹窗------*/
            $('.sortBrn').on('click', function () {
                $('.cover_btm').show().find('ul').animate({
                    "bottom": 0
                });
            });
            $('.cover_btm').on('click', function () {
                $('.cover_btm').hide().find('ul').animate({
                    "bottom": -4.5 + 'rem'
                });
            });
            this.eventResult(that);
        }
        , eventResult: function (that) {
            /*顶部额度选择*/
            that.$moneyBtn.on('click', function () {
                $('.money>em').text($(this).text());
                that.Smoney = $(this).text().replace("元", "").replace("万", "0000").replace("金额不限", "");
                $(this).addClass('moneyCoverClick').siblings('li').removeClass('moneyCoverClick');
                local.screenMoneyIdx = $(this).index();
                local.screenMoney = that.Smoney;
                local.screenShowMoney = $(this).text();
                that.pageSize = 1;
                that.loading = 'false';
                that.doProductsListView();
                that.myScroll.scrollToElement(wrapper, 0);
            });
            /*顶部-个性选择*/
            var $indentBtn = $('.indentBox>span')
                , $haveBtn = $('.have>span')
                , $needBtn = $('.need>span');
            /*顶部身份*/
            $indentBtn.on('click', function () {
                if ($(this).hasClass('loanTypeCoverClick')) {
                    $indentBtn.removeClass('loanTypeCoverClick');
                    that.SidentIdx = 0;
                    local.screenIdentIdx = 0;
                }
                else {
                    $(this).addClass('loanTypeCoverClick').siblings('span').removeClass('loanTypeCoverClick');
                    that.SidentIdx = $(this).data("id");
                    local.screenIdentIdx = $(this).data("id");
                }
            });
            /*顶部我有*/
            $('.have>span').on('click', function () {
                $(this).toggleClass('loanTypeCoverClick');
            });
            /*顶部我需要*/
            $('.need>span').on('click', function () {
                $(this).toggleClass('loanTypeCoverClick');
            });
            /*顶部重置按钮*/
            $('.resetBtn').on('click', function () {
                $indentBtn.removeClass('loanTypeCoverClick');
                that.SidentIdx = 0;
                local.screenIdentIdx = 0;
                $.each($haveBtn, function () {
                    $(this).removeClass('loanTypeCoverClick');
                });
                $.each($needBtn, function () {
                    $(this).removeClass('loanTypeCoverClick');
                });
            });
            /*顶部确认按钮*/
            $('.sureBtn').on('click', function () {
                    $('.cover_top').hide();
                    //个性选择-我有
                    that.ShaveIdx = [];
                    $.each($haveBtn, function () {
                        if ($(this).hasClass('loanTypeCoverClick')) {
                            that.ShaveIdx.push($(this).attr('id'));
                        };
                        local.screenHaveIdx = JSON.stringify(that.ShaveIdx);
                    });
                    //个性选择-我需要
                    var SneedIdx = [];
                    $.each($needBtn, function () {
                        if ($(this).hasClass('loanTypeCoverClick')) {
                            SneedIdx.push($(this).attr('id'));
                        };
                        local.screenNeedIdx = JSON.stringify(SneedIdx);
                    });
                    that.$topSpan.removeClass('topClick');
                    that.pageSize = 1;
                    that.loading = 'false';
                    that.doProductsListView();
                    that.myScroll.scrollToElement(wrapper, 0);
                })
                /*底部排序筛选*/
            that.$btmBtn.on('click', function () {
                $(this).addClass('cover_btm_click').siblings('li').removeClass('cover_btm_click');
                local.screenSortIdx = $(this).data('value');
                that.pageSize = 1;
                that.loading = 'false';
                that.SsortIdx = $(this).data('value');
                that.doProductsListView();
                that.myScroll.scrollToElement(wrapper, 0);
            })
        }
    }, //判断安卓浏览器直接下载（推广需求）
    androidDownload: function () {
        if (Terminal.platform.android) {
            window.location.href = "http://download.sudaizhijia.com/android/sudaizhijia/v2/sdzj-last_release-cpa-sign.apk";
        }
    }
}
$(function () {
    productController.initView();
    //4.2.4获取个性选择标签
    service.doAjaxRequest({
        url: '/v1/product/searchtag'
        , type: 'GET'
        , async: false
    , }, function (json) {
        productController.doSearchtagView(json);
    });
});
