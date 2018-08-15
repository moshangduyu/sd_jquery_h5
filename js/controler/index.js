var indexController = {
    initView: function () {
        /*刷新加载*/
        var myScroll = this.myScroll = new IScroll('#wrapper', {
            probeType: 3,
            scrollbars: false,
            click: true
        });
        localFun.downloadCover(.9); //底部下载弹窗
        localFun.messageIcon(); //消息铃铛
        this.initSearchView();
        this.initPromotionQuestionView();
        this.scrollEvent.init(myScroll);
        this.countVisit();
        return myScroll;
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
    },
    //提示信息弹窗
    initPromotionQuestionView: function () {
        $('#recommend_Btn').click(function () {
            $.promptCover({
                content: "据您个人信息为您精准推荐最适合产品，请务必保证信息真实完整，以提高推荐精度。<p style='text-align:center;padding-top:.3rem;'>在“我的”可完善身份信用。</p>"
            });
        });
        $('#new_Btn').click(function () {
            $.promptCover({
                content: "速贷之家为全国最大速贷新品首发平台！您可到速贷大全－排序查看最新产品！"
            });
        });
    },
    /*图片轮播*/
    doBannerSwiperView: function (data) {
        var html = "";
        $.each(data, function (i, b) {
            html += "<div class='swiper-slide'>" + "<a href=" + b.h5_link + "><img src=" + b.src + " alt=''></a>" + "</div>"
        })
        $(".banner").html(html);
        var mySwiper = new Swiper('#lunbo', {
            direction: 'horizontal',
            loop: true,
            autoplay: 3000
            //            pagination: '.swiper-pagination' // 如果需要分页器
        });
    },
    //诱导轮播
    doPromotionView: function (data) {
        var html = "",
            x = data;
        $.each(x.list, function (i, b) {
            html += '<li id=' + b.platform_id + '>' + '<dl>' + '   <dt><img src=' + b.product_logo + ' alt=""></dt>' + '  <dd>' + '     <h3 id=' + b.platform_product_id + '>' + b.platform_product_name + '</h3>' + '    <p><i class="random_city"></i>市的<i class="random_name"></i><i class="random_mobile"></i> 今日借款<b class="random_money" data-min=' + b.loan_min + ' data-max=' + b.loan_max + '></b>已到账</p>' + '</dd>' + '</dl>' + '</li>';
        });
        $(".font_inner").html(html);
        this.advertisement.random(0);
        this.advertisement.poster(this.advertisement);
        $(".applicants>em").text(x.apply_num)
        $(".font_inner>li").on("click", function () {
            var productId = $(this).find("h3").attr("id");
            window.location.href = "/html/product_result.html?productId=" + productId
        })
    },
    //touch专题
    doSubjectsBannerView(data) {
        $.each(data, function (i, b) {
            $(".newSelected").append("<div class='swiper-slide'><a href=" + b.h5_link + "><img src=" + b.src + "></a></div>")
        })
        var swiper = new Swiper('#newSelected', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: false,
            slidesPerView: 1.7,
            spaceBetween: 10,
            grabCursor: false,
            freeMode: true
        });

    },
    //分类专题
    doSpecialListView: function (data) {
        var html = "";
        $.each(data.list, function (i, b) {
            html += "<img src=" + b.src + " data-id=" + b.id + " data-title=" + b.title + ">";
        })
        $(".themes_imgbox").html(html);
        this.myScroll.refresh();
        $(".themes_imgbox img").click(function () {
            var listId = $(this).data("id"),
                title = $(this).data("title");
            window.location.href = "/html/index_list.html?listId=" + listId + "&title=" + title
        });
        var nLen = $(".themes_imgbox img").length;
        if (nLen % 3 != 0) {
            var addNum = 3 - $(".themes_imgbox img").length % 3;
            for (var i = 0; i < addNum; i++) {
                $(".themes_imgbox").append('<img src="img/moreactivity.png" alt="">')
            }
        }
    },
    　　　 //推荐产品　　　　　
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
            html += "<dl data-id=" + b.platform_product_id + "><dt><img src=" + b.product_logo + "></dt>" +
                "<dd>" +
                "<p><em>" + b.platform_product_name + "</em>" +
                "<br><span>" + b.loan_min + "-" + b.loan_max + "</span>" +
                "<br>成功率<b>" + b.success_rate + "</b></p>" +
                "</dd>" +
                "</dl>";
        };

        $("#recommend_list").html(html);
        $("#recommend_list>dl").on('click', function () {
            var productId = $(this).data("id");
            window.location.href = "/html/product_result.html?productId=" + productId
        });
    },
    //新品入住
    doViewNewproducts: function (data) {
        var html = "";
        $.each(data, function (i, b) {
            html += '<dl class="terrace_list" data-id=' + b.platform_product_id + '>' + '<dt><div><img src=' + b.product_logo + '></div></dt>' + '<dd>' + '<h3><span class="gradient">' + b.update_date + '</span><b id=' + b.platform_product_id + '>' + b.platform_product_name + '</b> ' + b.product_conduct + '</h3>' + '<p class="p1 terrace_list_p1">'
            $.each(b.tag_name, function (x, y) {
                html += " <span style='color:#" + y.font_color + ";border-color:#" + y.boder_color + ";background:#" + y.bg_color + ";'>" + y.name + "</span>";
            })
            html += '</p>' + '<p class="p2">' + b.product_introduct + '</p>' + '</dd>' + '</dl>'
        })
        $("#new_terrace").html(html);
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
        $(".terrace_list").click(function () {
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
                that.doLocationView.initView();
            }

        };
    },
    /*单行广告轮播*/
    advertisement: {
        poster: function (advertisement) {
            var liHeight = $(".font_inner li").height(); //一个li的高度
            var clickEndFlag = true; //设置每张走完才能再点击
            setInterval(function () {
                advertisement.random(1)
                $(".font_inner").animate({
                    top: -liHeight
                }, 500, function () {
                    $(".font_inner li").eq(0).appendTo($(".font_inner"));
                    $(".font_inner").css({
                        "top": 0
                    });
                })
            }, 3000)
        },
        random: function (idx) {
            //1.随机生成身份
            var arr = ["上班族", "学生党"];
            var name = arr[Math.floor(Math.random() * arr.length)];
            $(".font_inner li").eq(idx).find(".random_name").text(name);
            //2.随机生成电话号码
            var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
            var i = parseInt(10 * Math.random());
            var prefix = prefixArray[i];
            for (var j = 0; j < 8; j++) {
                prefix = prefix + Math.floor(Math.random() * 10);
            }
            var phone = prefix.substring(0, 6) + "***" + prefix.substring(9, 11);
            $(".font_inner li").eq(idx).find(".random_mobile").text(phone);
            //3.随机生成价钱
            function rnd() {
                var min = $(".font_inner li").eq(idx).find(".random_money").data("min") / 100;
                var max = $(".font_inner li").eq(idx).find(".random_money").data("max") / 100;
                var money = parseInt((min + Math.floor(Math.random() * (max - min + 1))) / 5) * 5;
                if (money == 0) {
                    var money = 5;
                }
                $(".font_inner li").eq(idx).find(".random_money").text(money + "00元");
            }
            rnd()
            //4.随机生成数组内城市
            var arr = ["长丰", "肥西", "肥东", "黄山", "祁门", "福州", "闽清", "闽侯", "罗源", "连江", "长乐", "福清", "兰州", "皋兰", "榆中", "永登", "永昌", "白银", "会宁", "景泰", "靖远", "天水", "甘谷", "武山", "清水", "张家川", "嘉峪关", "酒泉", "敦煌", "广州", "从化", "增城", "番禺", "汕头", "潮阳", "澄海", "南澳", "深圳", "珠海", "南宁", "隆安", "马山", "上林", "武鸣", "宾阳", "邕宁", "贵阳", "息烽", "开阳", "修文", "清镇", "六盘水", "海口", "三亚", "通什", "琼海", "儋州", "文昌", "万宁", "东方", "澄迈", "荥阳", "登封", "新郑", "中牟", "密县", "巩义", "洛阳", "宜阳", "洛宁", "新安", "哈尔滨", "巴彦", "双城", "呼兰", "武汉", "汉阳", "新洲", "武昌", "宜昌", "秭归", "远安", "当阳", "长阳", "郴州", "安仁", "永兴", "桂东", "桂阳"]
            var city = arr[Math.floor(Math.random() * arr.length)];
            $(".font_inner li").eq(idx).find(".random_city").text(city);
        }
    },
    //scroll滑动事件
    scrollEvent: {
        myScroll: null,
        finished: true,
        refresh: false,
        init: function (myScroll) {
            this.myScroll = myScroll;
            this.scrollStart(this.myScroll);
        },
        scrollStart: function (myScroll) {
            myScroll.on('scrollStart', function () {
                startY = myScroll.y
            });
            this.scrollIn(myScroll, this);
        },
        scrollIn: function (myScroll, scrollEvent) {
            myScroll.on('scroll', function () {
                var scrollY = -myScroll.y
                var wrapperHeight = $("#thelist").height() - $("#wrapper").height();
                //下拉刷新
                if (scrollEvent.finished && scrollY < -40 && startY == 0) {
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
                    if (scrollY >= -10 && !scrollEvent.refresh) {
                        $('.head_top').show();
                    }
                });
                //上拉加载
                if (scrollEvent.finished && startY <= this.maxScrollY && this.maxScrollY + scrollY >= 80) {
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
                //导航栏背景
                //            if (scrollY > 100) {
                //                $(".head_top").addClass('gradient');
                //            } else {
                //                $(".head_top").removeClass('gradient');
                //            }
                scrollEvent.scrollEnd(myScroll);
            });
        },
        scrollEnd: function (myScroll) {
            myScroll.on('scrollEnd', function () {
                myScroll.refresh();
            });
        }
    },
    //登录定位统计
    doLocationView: {
        initView: function () {
            var that = this;
            /**
             *判断是否存在设备id
             *没有赋值随机生成 initEquipmentView()
             */
            if (!localStorage.sd_equipment_id) {
                localStorage.sd_equipment_id = that.initEquipmentView();
            };
            this.doAddressView();
        },
        //定位统计传参--设备id
        initEquipmentView: function () {
            var userAgent = $.trim(navigator.userAgent),
                reviceNum = userAgent.substr(0, 12);
            var d = new Date(),
                timeNum = $.trim(d.getFullYear() + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + (d.getDate() < 10 ? "0" : "") + d.getDate() + (d.getHours() < 10 ? "0" : "") + d.getHours() + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes());

            function GetRandomNum(Min, Max) {
                var Range = Max - Min;
                var Rand = Math.random();
                return (Min + Math.round(Rand * Range));
            }
            var random = GetRandomNum(1000000000, 9999999999);
            return $.trim(reviceNum) + "-" + timeNum + "-" + random;
        },
        //定位功能
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
                        "deviceId": localStorage.sd_equipment_id,
                        "userCity": userCity,
                        "userAddress": userAddress,
                        "lonLat": lonLat,
                        "areaId": '0'
                    }
                }, function (json) {
                    $.cookie('homePage_location', 'false', {
                        expires: 7,
                        path: '/'
                    });
                })
            }
            //解析定位错误信息
            function onError(data) {}
        }
    }


};
$(function () {
    indexController.initView();
    /*首页banner*/
    service.doAjaxRequest({
        'url': '/v2/banners',
        'type': 'GET'
    }, function (json) {
        indexController.doBannerSwiperView(json);
    });
    /*诱导轮播*/
    service.doAjaxRequest({
        'url': '/v1/product/promotion',
        'type': 'GET'
    }, function (json) {
        indexController.doPromotionView(json);
    });
    /*推荐产品*/
    service.doAjaxRequest({
        'url': '/v1/product/recommends',
        'type': 'GET'
    }, function (json) {
        indexController.doNextbatchView(json.list);
        //下一批
        $(".nextBatch").click(function () {
            indexController.doNextbatchView(json.list);
        })
    });
    /*速贷专题推荐*/
    service.doAjaxRequest({
        'url': '/v1/banners/subjects',
        'type': 'GET',
        'async': false
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
