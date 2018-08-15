var indexController = {
    initView: function () {
        /*刷新加载*/
        var myScroll = this.myScroll = new IScroll('#wrapper', {
            probeType: 3,
            scrollbars: false,
            click: true,
            onScrollMove: function () {}
        });
        localFun.doFixedNav(); //悬浮导航栏
        localFun.downloadCover(0); //底部下载弹窗
        localFun.messageIcon(); //消息铃铛
        this.initBaseView();
        this.initSearchView();
        this.initPromotionQuestionView();
        this.scrollEvent.init(myScroll);
        this.countVisit();
    },
    /*base64解密微信授权登录*/
    initBaseView: function () {
        var sd_wechat_login = $.GetQueryString('sd_wechat_login'),
            onloan_login = $.GetQueryString('onloan_login');
        if (sd_wechat_login) {
            loginData(sd_wechat_login);
        } else if (onloan_login) {
            loginData(onloan_login)
        };

        function loginData(basekey) {
            var url = basekey.replace(/\*/g, '=');
            var base = new $.Base64();
            var result = base.decode(url);
            var result_local = JSON.parse(result);
            local.userId = result_local.sd_user_id;
            local.indent = result_local.indent;
            local.username = result_local.username;
            local.phone = result_local.mobile;
            local.sex = result_local.sex;
            local.name = result_local.realname;
            local.token = result_local.accessToken;
        }
    },
    /*搜索*/
    initSearchView: function () {
        $("#select_money").change(function () {
            $(this).next("b").text($(this).find("option:selected").text());
            var money = $(".select_money").find("b").text();
            var moneys = money.replace("元", "").replace("金额不限", "").replace("万", "0000");
            local.screenMoneyIdx = $("option:selected").index();
            local.screenMoney = moneys;
            local.screenShowMoney = $(this).next("b").text();
            window.location.href = "/html/product.html"
        });
    }, //提示信息弹窗
    initPromotionQuestionView: function () {
        $('#recommend_Btn').on('click', function () {
            $.promptCover({
                content: "据您个人信息为您精准推荐最适合产品，请务必保证信息真实完整，以提高推荐精度。<p style='text-align:center;padding-top:.3rem;'>在“我的”可完善身份信用。</p>"
            });
        });
        $('#new_Btn').on('click', function () {
            $.promptCover({
                content: "速贷之家为全国最大速贷新品首发平台！您可到速贷大全－排序查看最新产品！"
            });
        });
    }, //推荐产品　　　　　
    theNextbatchIndex: 1,
    doNextbatchView: function (list) {
        var html = "";
        var pageNum = Math.ceil(list.length / 8);
        var lenEnd = 8 * this.theNextbatchIndex;
        var startI = 8 * (this.theNextbatchIndex - 1);
        if (this.theNextbatchIndex == pageNum) {
            lenEnd = list.length;
            this.theNextbatchIndex = 1;
        } else {
            this.theNextbatchIndex++;
        }
        for (var i = startI; i < lenEnd; i++) {
            var b = list[i];
            html += "<dl data-id=" + b.platform_product_id + "><dt><img src=" + b.product_logo + " ></dt>" + "<dd>" + "<p><em>" + b.platform_product_name + "</em>" + "<br><span>" + b.loan_min + "-" + b.loan_max + "</span>" + "<br>成功率<b>" + b.success_rate + "</b></p>" + "</dd>" + "</dl>";
        };
        $("#recommend_list").html(html);
        $("#recommend_list").on('click', 'dl', function () {
            var productId = $(this).data("id");
            window.location.href = "/html/product_result.html?productId=" + productId
        });
    }, //touch专题
    doSubjectsBannerView: function (data) {
        $.each(data, function (i, b) {
            $(".newSelected").append("<div class='swiper-slide'><a href=" + b.h5_link + "><img src=" + b.src + "></a></div>")
        });
        var swiper = new Swiper('#newSelected', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: false,
            slidesPerView: 1.83,
            spaceBetween: 10,
            grabCursor: false,
            freeMode: true
        });
    }, //分类专题
    doSpecialListView: function (data) {
        var html = "";
        $.each(data.list, function (i, b) {
            html += "<img src=" + b.src + " data-id=" + b.id + "  data-title=" + b.title + "  data-type=" + b.payback_type + ">";
        })
        $(".themes_imgbox").html(html);
        this.myScroll.refresh();
        $(".themes_imgbox>img").on('click', function () {
            var type = $(this).data('type'),
                listId = $(this).data("id"),
                title = $(this).data("title");
            if (type == "creditcard_payback") {
                window.location.href = "/html/credit_givebacks.html";
            } else {
                window.location.href = "/html/index_list.html?listId=" + listId + "&title=" + title
            }
        });
        var nLen = $(".themes_imgbox img").length;
        if (nLen % 3 != 0) {
            $(".themes_imgbox").append('<img src="img/moreactivity.png" class="coming_soon">');
            $('.coming_soon').on('click', function () {
                $.popupCover({
                    content: "敬请期待"
                })
            })
        }
    }, //新品入住
    doViewNewproducts: function (data) {
        var html = "";
        $.each(data, function (i, b) {
            html = '<dl class="terrace_list" data-id=' + b.platform_product_id + '>' + '<dt><div><img src=' + b.product_logo + '></div></dt>' + '<dd>' + '<h3><span class="gradient">' + b.update_date + '</span><b id=' + b.platform_product_id + '>' + b.platform_product_name + '</b> ' + b.product_conduct + '</h3>' + '<p class="p1 terrace_list_p1">'
            $.each(b.tag_name, function (x, y) {
                html += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
            })
            html += '</p>' + '<p class="p2">' + b.product_introduct + '</p>' + '</dd>' + '</dl>';
            $(html).appendTo($("#new_terrace"));
        })
        //        $("img.lazy").lazyload({
        //            effect: "fadeIn"
        //            , threshold: 200
        //        });
        this.myScroll.refresh();
        //span省略号显示
        $.each($(".terrace_list_p1"), function () {
            var $span = $(this).find("span");
            var len = $span.length;
            if (len > 4) {
                $span.eq(3).nextAll("span").hide();
                $(this).append('<i class="sl"></i>');
            }
        });
        //点击产品跳转
        $(".terrace_list").on('click', function () {
            var productId = $(this).data('id');
            window.location.href = "/html/product_result.html?productId=" + productId
        })
    },
    /*登录统计*/
    countVisit: function () {
        var that = this;
        if (localStorage.userId) {
            //统计访问用户量
            service.doAjaxRequest({
                url: '/v1/data/activeuser',
                type: 'POST',
                data: {}
            }, function (json) {});
            //统计定位信息
            var locationCookie = $.cookie('homePage_location') || '';
            if (locationCookie == '') {
                $.cookie('homePage_location', 'false', {
                    expires: 7,
                    path: '/'
                });
                that.doLocationView.initView();
            }
        };
    }, //scroll滑动事件
    scrollEvent: {
        myScroll: null,
        finished: true,
        refresh: false,
        init: function (myScroll) {
            this.scrollStart(myScroll);
        },
        scrollStart: function (myScroll) {
            myScroll.on('scrollStart', function () {
                startY = myScroll.y
            });
            this.scrollIn(myScroll);
        },
        scrollIn: function (myScroll) {
            var that = this;
            myScroll.on('scroll', function () {
                $('.pullUpImg').show();
                var scrollY = -myScroll.y
                //下拉刷新
                if (that.finished && scrollY < -40 && startY == 0) {
                    finished = false;
                    $('#pullDown-msg').text('松开刷新');
                    $('#PullDown').css({
                        "position": "static"
                    });
                    myScroll.scrollToElement(PullDown, 0);
                    $('#wrapper').on('touchend', function () {
                        $('#pullDown-msg').text('刷新中...');
                        refresh = true;
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000)
                    });
                }
                myScroll.on('scrollEnd', function () {
                    if (scrollY >= -10 && !that.refresh) {
                        $('.head_top').show();
                    }
                });
                //上拉加载
                if (that.finished && startY <= this.maxScrollY && this.maxScrollY + scrollY >= 80) {
                    finished = false;
                    blink();

                    function blink() {
                        $('.pullUpImgClose').show();
                        setTimeout(function () {
                            $('.pullUpImgClose').hide();
                        }, 1000)
                    };
                    var interval = setInterval(function () {
                        blink();
                    }, 2000);
                    var timeout = setTimeout(function () {
                        clearInterval(interval);
                        setTimeout(function () {
                            window.location.href = "/html/product.html"
                        });
                    }, 6000);
                    myScroll.on('scrollEnd', function () {
                        finished = true;
                        clearInterval(interval);
                        clearInterval(timeout);
                        $('.pullUpImgClose').show();
                        window.location.href = "/html/product.html"
                    });
                }
                that.scrollEnd(myScroll);
            });
        },
        scrollEnd: function (myScroll) {
            myScroll.on('scrollEnd', function () {
                myScroll.refresh();
            });
        }
    }, //登录定位统计
    doLocationView: {
        initView: function () {
            var that = this;
            this.doAddressView();
        }, //定位功能
        doAddressView: function () {
            var map, geolocation;
            //加载地图，调用浏览器定位服务
            map = new AMap.Map('', {
                resizeEnable: true
            });
            map.plugin('AMap.Geolocation', function () {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,
                    timeout: 10000,
                    buttonPosition: 'RB'
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);
                AMap.event.addListener(geolocation, 'error', onError);
            });
            //解析定位结果
            function onComplete(data) {
                longitude = data.position.getLng();
                latitude = data.position.getLat();
                gpsPoint = new BMap.Point(longitude, latitude);
                BMap.Convertor.translate(gpsPoint, 0, translateCallback);
            }
            translateCallback = function (point) {
                baiduPoint = point;
                var geoc = new BMap.Geocoder();
                geoc.getLocation(baiduPoint, getCityByBaiduCoordinate);
            }

            function getCityByBaiduCoordinate(rs) {
                baiduAddress = rs.addressComponents;
                var userAddress = baiduAddress.city + baiduAddress.district + baiduAddress.street + baiduAddress.streetNumber;
                var userCity = baiduAddress.city;
                local.sd_positionmessage = userCity;
                /*11.1.2地域定位统计*/
                var lonLat = longitude + ',' + latitude;
                service.doAjaxRequest({
                    url: '/v1/location/device',
                    type: 'POST',
                    async: false,
                    data: {
                        "deviceId": $.cookie('sd_equipment_id'),
                        "userCity": userCity,
                        "userAddress": userAddress,
                        "lonLat": lonLat,
                        "areaId": '0',
                        "locationType": '2'
                    }
                })
            }
            //解析定位错误信息
            function onError(data) {}
        }
    }
};
$(function () {
    indexController.initView();
    /*推荐产品*/
    service.doAjaxRequest({
        'url': '/v1/product/recommends',
        'type': 'GET',
        data: {
            'terminalType': 3
        }
    }, function (json) {
        indexController.doNextbatchView(json.list);
        $(".nextBatch").on('click', function () {
            indexController.doNextbatchView(json.list);
        })
    });
    /*速贷专题推荐*/
    service.doAjaxRequest({
        'url': '/v1/banners/subjects',
        'type': 'GET'
    }, function (json) {
        indexController.doSubjectsBannerView(json);
    });
    /*分类专题*/
    service.doAjaxRequest({
        'url': '/v2/banners/special',
        'type': 'GET'
    }, function (json) {
        indexController.doSpecialListView(json)
    });
    /*新品入驻*/
    service.doAjaxRequest({
        'url': '/v1/product/online',
        'type': 'GET'
    }, function (json) {
        indexController.doViewNewproducts(json);
    });
});
