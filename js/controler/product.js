var productController = {
    initView: function () {
        this.myScroll = new IScroll('#wrapper', {
            probeType: 3,
            scrollbars: true,
            click: true,
            shrinkScrollbars: "clip"
        });
        this.$topSpan = $('.product_head_btm>span');
        this.$btmBtn = $('.cover_btm_box>li');
        this.$moneyBtn = $('.moneyCover>ul>li');
        this.$indentBtn = $('.indentBox>span');
        /*获取筛选存储的筛选条件*/
        this.SmoneyIdx = localStorage.screenMoneyIdx || ''; //筛选金额下标
        this.SsortIdx = localStorage.screenSortIdx || '1'; //排序下标
        this.Smoney = localStorage.screenMoney || ''; //筛选额度
        //筛选身份ID
        if (localStorage.screenIdentIdx) {
            this.SidentIdx = localStorage.screenIdentIdx;
        } else {
            this.SidentIdx = localStorage.indent || '0';
        }
        //筛选我有
        if (localStorage.screenHaveIdx) {
            this.ShaveIdx = JSON.parse(localStorage.screenHaveIdx);
            if (this.ShaveIdx.length == 0) {
                this.ShaveIdx = '';
            }
        } else {
            this.ShaveIdx = '';
        };
        //筛选我需要
        if (localStorage.screenNeedIdx) {
            this.SneedIdx = JSON.parse(localStorage.screenNeedIdx);
            if (this.SneedIdx.length == 0) {
                this.SneedIdx = '';
            }
        } else {
            this.SneedIdx = '';
        };
        this.pageSize = 1;
        this.loading = 'false';

        //底部下载弹窗
        localFun.downloadCover(.9);
        this.initLocationView();
        this.doProductsListView();
        this.pageingLoad.scroll(this.myScroll);
    },
    //判断是否存在定位城市
    initLocationView: function () {
        if (localStorage.cityLocation) {
            $('.cityLocation').text(localStorage.cityLocation);
        } else {
            $('.cityLocation').text('全国');
        }
    },
    //获取筛选标签
    doSearchtagView: function (json) {
        var haveSpan = '',
            needSpan = '';
        $.each(json.loan_has_lists, function (i, b) {
            haveSpan += '<span id=' + b.id + '>' + b.value + '</span>';
        });
        $('.have').html(haveSpan);
        $.each(json.loan_need_lists, function (i, b) {
            needSpan += '<span id=' + b.id + '>' + b.value + '</span>';
        });
        $('.need').html(needSpan);
        this.screen.init(this);
    },
    //筛选＆显示产品列表
    doProductsListView: function () {
        var that = this;
        if (localStorage.screenHaveIdx) {
            var ShaveIdx = JSON.parse(localStorage.screenHaveIdx).join(',');
        } else {
            var ShaveIdx = '';
        };
        if (localStorage.screenNeedIdx) {
            var SneedIdx = JSON.parse(localStorage.screenNeedIdx).join(',');
        } else {
            var SneedIdx = '';
        };
        //        console.log(that.SidentIdx + '|' + that.Smoney + '|' + ShaveIdx + '|' + SneedIdx + '|' + that.SsortIdx + '|' + that.pageSize);
        service.doAjaxRequest({
            url: '/v1/product/lists',
            type: 'GET',
            async: false,
            data: {
                "productType": that.SsortIdx,
                "indent": that.SidentIdx,
                "loanMoney": that.Smoney,
                "pageSize": that.pageSize,
                "pageNum": 10,
                "loanNeed": SneedIdx,
                "loanHas": ShaveIdx || '',
                "areaId": localStorage.cityId || '0'
            }
        }, function (json) {
            var html = "";
            $.each(json.list, function (i, b) {
                html += "<div class='produc_touch_results' data-type=" + b.platform_product_id + ">" + "<dl class='res_top'>" + "<dt><img src=" + b.product_logo + "></dt>" + "<dd>" + " <h3>" + b.platform_product_name + "</h3>";
                if (that.SsortIdx == 7) {
                    html += " <h6 style='height:.35rem;line-height:.37rem;'>平均额度：<b>" + b.star + "</b> 元" + "<em style='line-height:.37rem;float:right;padding-right:.3rem;color:#808080'>" + b.success_count + "人已申请</em></h6>"
                } else {
                    html += " <span class='product_xing'><b>" + b.star + "</b><i></i>" + " <i></i>" + " <i></i>" + " <i></i>" + "<i></i>" + "<em>" + b.success_count + "人已申请</em></span>"
                };
                html += " <p class='p1'>";
                $.each(b.tag_name, function (x, y) {
                    html += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
                });
                html += "</p>" + "<em class='rightIcon'>" + "</em>" + "</dd>" + "</dl>" + "<div class='res_btm'>" + "<div>" + b.product_introduct + "</div>" + "<p></p>" + " </div>" + "</div>";
            })
            if (that.loading == 'true') {
                $(".scroll").append(html);
            } else {
                $(".scroll").html(html);
            };
            localFun.starSmall();
            that.pageCode = json.pageCount;
            that.pageSize++;
            that.myScroll.refresh();
            if (that.pageCode > 1) {
                $("#PullUp").html('努力加载中...');
            } else {
                $("#PullUp").html('已加载全部产品');
            }
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
            $(".scroll").html(html3);
            that.myScroll.refresh();
            that.loading = 'false';
            that.pageCode = 0;
            that.pageSize = 1;
        })
    },
    //分页加载
    pageingLoad: {
        bool: true,
        scroll: function (myScroll) {
            var _that = this;
            myScroll.on('scroll', function () {
                var bottomHeight = this.y - this.maxScrollY;

                if (bottomHeight <= 200 && _that.bool) {

                    _that.bool = false;
                    if (productController.pageSize <= productController.pageCode) {
                        productController.loading = 'true';
                        setTimeout(function () {
                            productController.doProductsListView();
                        }, 300)
                    } else {
                        $("#PullUp").html('已加载全部产品');
                        myScroll.refresh();
                    }
                }
            });
            _that.scrollEnd(myScroll);
        },
        scrollEnd: function (myScroll) {
            var _that = this;
            myScroll.on('scrollEnd', function () {
                _that.bool = true;
            });
        }
    },
    //筛选条件
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
            var numLength = $('.loanTypeCoverClick').length;
            var showText = $('.loanTypeCoverClick').eq(0).text();
            if (numLength == 1) {
                $('.loanType>em').text(showText);
            } else if (numLength > 1) {
                $('.loanType>em').text(showText + '...');
            }
            /*底部排序筛选*/
            $('#sort' + that.SsortIdx).addClass('cover_btm_click');
            this.coverAction(that);
        },
        coverAction: function (that) {
            that.$topSpan.click(function () {
                var idx = $(this).index();
                if ($(this).hasClass('topClick')) {
                    $(this).removeClass('topClick');
                    $('.cover_top').hide();
                } else {
                    $(this).addClass('topClick').siblings('span').removeClass('topClick');
                    $('.cover_top').show();
                    var coverH2 = $('.moneyCover').height(),
                        coverH3 = $('.loanTypeCover').height();
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
                $('.loanTypeCover').click(function (e) {
                    e.stopPropagation();
                });
                $('.cover_top').click(function () {
                    $(this).hide();
                    that.$topSpan.removeClass('topClick');
                })
            });
            /*------底部排序弹窗------*/
            $('.sortBrn').click(function () {
                $('.cover_btm').show().find('ul').animate({
                    "bottom": 0
                });
            });
            $('.cover_btm').click(function () {
                $('.cover_btm').hide().find('ul').animate({
                    "bottom": -4.5 + 'rem'
                });
            });
            this.eventResult(that);
        },
        eventResult: function (that) {
            /*顶部额度选择*/
            that.$moneyBtn.click(function () {
                $('.money>em').text($(this).text());
                that.Smoney = $(this).text().replace("元", "").replace("万", "0000").replace("金额不限", "");
                $(this).addClass('moneyCoverClick').siblings('li').removeClass('moneyCoverClick');
                local.screenMoneyIdx = $(this).index();
                local.screenMoney = that.Smoney;
                local.screenShowMoney = $(this).text();
                that.pageSize = 1;
                that.loading = 'false';
                that.doProductsListView();
            });
            /*顶部-个性选择*/
            var $haveBtn = $('.have>span'),
                $needBtn = $('.need>span');
            /*顶部身份*/
            that.$indentBtn.click(function () {
                //                if ($(this).hasClass('loanTypeCoverClick')) {
                //                    $(this).removeClass('loanTypeCoverClick');
                //                    local.screenIdentIdx = 0;
                //                    that.SidentIdx = 0;
                //                } else {
                $(this).addClass('loanTypeCoverClick').siblings('span').removeClass('loanTypeCoverClick');
                local.screenIdentIdx = $(this).data("id");
                that.SidentIdx = $(this).data("id");
                //                }
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
            $('.resetBtn').click(function () {
                that.$indentBtn.removeClass('loanTypeCoverClick').eq(0).addClass('loanTypeCoverClick');
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
            $('.sureBtn').click(function () {
                //个性选择-筛选选项展示
                var numLength = $('.loanTypeCoverClick').length;
                var showText = $('.loanTypeCoverClick').eq(0).text();
                if (numLength == 1) {
                    $('.loanType>em').text(showText);
                } else if (numLength > 1) {
                    $('.loanType>em').text(showText + '...');
                } else {
                    $('.loanType>em').text('个性选择');
                }
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
                loading = 'false';
                that.doProductsListView();
            })
            /*底部排序筛选*/
            that.$btmBtn.click(function () {
                $(this).addClass('cover_btm_click').siblings('li').removeClass('cover_btm_click');
                local.screenSortIdx = $(this).data('value');
                that.pageSize = 1;
                that.loading = 'false';
                that.SsortIdx = $(this).data('value');
                that.doProductsListView();
            })
        }
    }
}
$(function () {
    productController.initView();
    //4.2.4获取个性选择标签
    service.doAjaxRequest({
        url: '/v1/product/searchtag',
        type: 'GET',
        async: false,
    }, function (json) {
        productController.doSearchtagView(json);
    });
});
