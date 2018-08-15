var cityListController = {
    initView: function () {
        var that = this;
        that.myScroll = new IScroll('#wrapper', {
            probeType: 3,
            scrollbars: false,
            click: true
        });
        that.userAddress = "";
        that.lonLat = "";
        that.initJudgeView();
        that.doOperationView();
    },
    //初始判断
    initJudgeView: function () {
        var that = this;
        /**
         *判断是否存在地理定位
         *已有，展示在定位结果处
         *没有，调用定位功能 doAddressView()
         */
        if (localStorage.sd_positionmessage) {
            $("#address").text(localStorage.sd_positionmessage).addClass('sureCity');
        } else {
            that.doAddressView();
        }
    },
    //页面按钮交互
    doOperationView: function () {
        var that = this;
        //重新定位按钮
        $('.reposition').on('click', function () {
            $("#address").html('定位中...').removeClass('sureCity');
            that.doAddressView();
        });
        //点击城市筛选跳转
        $(document).on('click', '.cityList>li,.hotCitylist>span', function () {
            var userCity = $(this).text(),
                areaId = $(this).attr('id');
            /*11.1.2地域定位统计*/
            service.doAjaxRequest({
                url: '/v1/location/device',
                type: 'POST',
                async: false,
                data: {
                    "deviceId": $.cookie('sd_equipment_id'),
                    "userCity": userCity,
                    "userAddress": '',
                    "lonLat": '',
                    "areaId": '0'
                }
            }, function () {})
            local.cityLocation = userCity;
            local.cityId = areaId;
            window.location.href = document.referrer;
        });
        //定位城市点击
        $('#address').on('click', function () {
            if ($(this).hasClass('sureCity')) {
                local.cityLocation = $(this).text();
                local.cityId = localStorage.addressId;
                window.location.href = document.referrer;
            }
        });
    },
    //字母索引
    initSliderView: function () {
        var that = this;
        var items = ["hotCity", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var html = "";
        $.each(items, function (i, obj) {
            html += "<li><a class='aToz' href=#" + obj + ">" + obj + "</a></li>";
        });
        $('.slider-nav>ol').html(html);
        $('ol>li').eq(0).css({
            "height": .6 + "rem"
        });
        $('ol>li').eq(0).find('a').html("热门").css({
            "display": "block",
            "background": "url(../img/dingwei.png) no-repeat center top",
            "background-size": .3 + "rem",
            "padding-top": .3 + "rem",
            "font-size": .18 + "rem"
        });
        var $navli = $('.slider-nav li a');
        $navli.on('click', function (e) {
            e.preventDefault();
            var target = this.hash;
            that.myScroll.scrollToElement(target, 500);
            return false
        });
        that.myScroll.on('scroll', function () {
            var hotCityH = $('#hotCity').height(),
                top = $("#wrapper").offset().top;

            if (this.y >= -hotCityH) {
                $('.fixedNav,.centerfixedNav').fadeOut(200);
            } else {
                $.each($('.slider-content>li'), function () {
                    var scrollTop = $(this).offset().top - top;
                    var content = $(this).find('h3').text();
                    if (scrollTop <= 0) {
                        $('.fixedNav,.centerfixedNav').html(content).show();
                    }
                });
            }
        });
        that.myScroll.on('scrollEnd', function () {
            var bottomHeight = this.y - this.maxScrollY;
            if (bottomHeight == 0 || this.y == 0) {
                $('.centerfixedNav').fadeOut(500);
            }
        });
    },
    //定位功能
    doAddressView: function () {
        var that = this;
        $("#address").text('定位中...')
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
            that.userAddress = baiduAddress.city + baiduAddress.district + baiduAddress.street + baiduAddress.streetNumber;
            var userCity = baiduAddress.city;
            $("#address").html(userCity).addClass('sureCity');
            local.sd_positionmessage = userCity;
            /*11.1.2地域定位统计*/
            that.lonLat = longitude + ',' + latitude;
            service.doAjaxRequest({
                url: '/v1/location/device',
                type: 'POST',
                async: false,
                data: {
                    "deviceId": $.cookie('sd_equipment_id'),
                    "userCity": userCity,
                    "userAddress": that.userAddress,
                    "lonLat": that.lonLat,
                    "areaId": '0'
                }
            }, function (json) {
                $('#address').attr('data-id', json.areaId);
                local.addressId = json.areaId;
            })


        }
        //解析定位错误信息
        function onError(data) {
            $("#address").html('定位失败');
        }
    },
    //城市列表数据渲染
    doCityListView: function (json) {
        var that = this;
        var data = json;
        var hotCity = "",
            cityList = "";
        $.each(data.hotCity, function (i, b) {
            hotCity += "<span id=" + b.id + " class=" + b.id + ">" + b.name + "</span>";
        })
        $(".hotCitylist").html(hotCity);

        $.each(data.list, function (i, b) {
            cityList += "<li id=" + b.initial + "><h3>" + b.initial + "</h3><ul class='cityList'>";
            $.each(b.citys, function (a, i) {
                cityList += "<li id=" + i.id + "  class=" + i.id + ">" + i.name + "</li>";
            });
            cityList += "</ul></li>";
        })
        $(".slider-content").html(cityList);
        that.myScroll.refresh();
        /*字母引导*/
        that.initSliderView();
        //判断显示标题显示
        if (localStorage.cityId && localStorage.cityLocation) {
            $('.' + localStorage.cityId).addClass('selectStyle');
            $('header>b').text('当前选择-' + localStorage.cityLocation);

        } else {
            $('header>b').text('选择城市');
        }
    }
};
$(function () {
    cityListController.initView();

    /*城市列表数据渲染*/
    service.doAjaxRequest({
        url: '/v1/location/devices',
        type: 'GET',
        async: false
    }, function (json) {
        cityListController.doCityListView(json);
    });
});
$(window).load(function () {
    cityListController.myScroll.refresh();
});
