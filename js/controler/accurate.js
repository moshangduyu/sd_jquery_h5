;
(function ($) {
    var shenZ = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    var userId = localStorage.userId,
        shenId = localStorage.indent;
    var num = 1,
        page1Change = false,
        page2Change = false,
        page3Change = false;
    $(".tab_b").eq(0).addClass("spanClick");
    $(".phone").val(localStorage.phone);
    showMessage();
    showInformation();
    showData();
    bankAjax();
    /*select color*/
    function selColor() {
        var selse = $("select").prev("label");
        $.each(selse, function () {
            var selTex = $(this).text();
            if (selTex != "请选择") {
                $(this).css({
                    "color": "#4d4d4d"
                })
            }
        })
    };
    //分页tab切换
    $(".tab_b").on('click', function () {
        var idx = $(this).index();
        $(this).addClass("spanClick").siblings("span").removeClass("spanClick");
        $(".tab_box").eq(idx).show().siblings(".tab_box").hide();
    });
    //身份判断
    identity()

    function identity() {
        if (shenId == 1) {
            numTotal = 22;
            $(".student").show();
            $(".credit").hide();
            $(".xuexin").show();
        }
        if (shenId == 2) {
            numTotal = 26;
            $(".wage").show();
        }
        if (shenId == 3) {
            numTotal = 26;
            $(".entrepreneur").show();
        }
        if (shenId == 4) {
            numTotal = 20;
            $(".else").show();
        }
    }
    //判断身份证号码性别男女
    $(".shenfen").bind("input propertychange", function () {
        var UUserCard = $(".shenfen").val();
        if ($(this).val().length == 15) {
            //获取性别 
            if (parseInt(UUserCard.substr(-1, 1)) % 2 == 1) {
                //男 
                $(".sex input").val("男")
            } else {
                //女 
                $(".sex input").val("女")
            }
        } else if ($(this).val().length == 18) {
            //获取性别 
            if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                //男 
                $(".sex input").val("男")
            } else {
                //女 
                $(".sex input").val("女")
            }
        } else {
            $(".sex input").val("")
        }
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
    }).blur(function () {
        if (!shenZ.test($(this).val())) {
            $.popupCover({
                content: '身份证号格式错误'
            })
        }
    });
    /*银行卡自动识别*/
    $(".bankCard").bind("input propertychange", function () {
        var bankNum = $(this).val();
        if (bankNum.length >= 16) {
            $.ajax({
                url: api_sudaizhijia_host + "/v1/bank/bankname",
                type: "get",
                dataType: "json",
                data: {
                    "account": bankNum
                },
                success: function (json) {
                    if (json.code == 200 && json.error_code == 0) {
                        if (json.data.name != "") {
                            $(".bank").text(json.data.name).css({
                                "color": "#4d4d4d"
                            });
                            $(".bank").attr("data-id", json.data.id);
                        }
                    }
                }
            })
        } else {
            $(".bank").text("请选择").css({
                "color": "#999"
            }).attr("data-id", "");
        }
    }).focus(function () {
        beforebankNum = $('.bankCard').val();
    }).blur(function () {
        var afterbankNum = $('.bankCard').val();
        if (beforebankNum == '' && afterbankNum != '') {
            num++;
            progressBar()
        }
        if (beforebankNum != '' && afterbankNum == '') {
            num--;
            progressBar()
        }
    });
    /*地理定位*/
    $("#address").on('click', function () {
        address()
    });

    function address() {
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
            userAddress = baiduAddress.city + baiduAddress.district + baiduAddress.street + baiduAddress.streetNumber;
            $("#address").html(baiduAddress.city + baiduAddress.district);
            num++;
            progressBar();
        }
        //解析定位错误信息
        function onError(data) {
            /*定位失败显示城市*/
            $("#address").html('定位失败');
        }
    }
    /*判断进度条展示*/
    function progressBar() {
        var progress_num = parseInt(num / numTotal * 100) + "%"
        $(".progress_num").text(progress_num);
        $(".progress_line").animate({
            "width": progress_num
        })
    }
    /*下一步按钮*/
    nextClick()

    function nextClick() {
        $(".oneNext").on('click', function () {
            if (!shenZ.test($(".shenfen").val()) && $(".shenfen").val() != "") {

                $.popupCover({
                    content: '身份证号格式错误'
                })
                return false;
            }
            $('.landingCover').show();
            /*基础信息-修改*/
            $.ajax({
                url: api_sudaizhijia_host + "/v1/userinfo/basic",
                type: "post",
                dataType: "json",
                data: {
                    "mobile": localStorage.phone,
                    "realName": $(".name").val(),
                    "identityCard": $(".shenfen").val(),
                    "account": $(".bankCard").val(),
                    "sex": $(".sex>input").val(),
                    "age": age,
                    "bankId": $(".bank").data("id") || "",
                    "alipay": $(".Alipay").val(),
                    "xuexinWebsite": $(".xuexin>.checked").text() || "",
                    "credit": $(".credit>.checked").text() || ""
                },
                success: function (json) {
                    $('.landingCover').hide();
                    if (json.code == 200 && json.error_code == 0) {
                        page1Change = true;
                        local.name = $(".name").val();
                        local.sex = $(".sex>input").val();

                        $.popupCover({
                            content: '保存成功',
                            callback: function () {
                                $(".tab_box").eq(0).hide().next(".tab_box").show();
                                $(".tab_b").eq(1).addClass("spanClick").siblings().removeClass("spanClick");
                            }
                        })
                    } else {
                        alert(json.error_message);
                        return false;
                    }
                }
            })
        })
        $(".twoNext").on('click', function () {
            var tel = $(".lianxirentel").val();
            var address = $(".address").text(),
                addressType = $(".addresstype").text(),
                marriage = $(".marriage>.checked").text(),
                emergencyContact = $(".lianxiren").val(),
                emergencyContactMobile = $(".lianxirentel").val(),
                emergencyContactRelation = $(".lianxirengx").text();
            if (tel != "" && !phonez.test(tel)) {
                $.popupCover({
                    content: '联系人手机号格式错误'
                })
                return false;
            }
            $('.landingCover').show();
            //学生
            if (shenId == 1) {
                var dataCenter = {
                    "address": address,
                    "addressType": addressType,
                    "marriage": marriage,
                    "emergencyContact": emergencyContact,
                    "emergencyContactMobile": emergencyContactMobile,
                    "emergencyContactRelation": emergencyContactRelation,
                    "schoolName": $(".schoolname").val(),
                    "studies": $(".xueye").text(),
                    "graduateLongYear": $(".biyetime").text()
                }
            }
            //上班族
            if (shenId == 2) {
                var dataCenter = {
                    "address": address,
                    "addressType": addressType,
                    "marriage": marriage,
                    "emergencyContact": emergencyContact,
                    "emergencyContactMobile": emergencyContactMobile,
                    "emergencyContactRelation": emergencyContactRelation,
                    "certificate": $(".xueli").text(),
                    "companyName": $(".gongsiname").val(),
                    "companyNature": $(".danwei").text(),
                    "workingYears": $(".gongnianxian").text(),
                    "isCompanyEmail": $(".email>.checked").text(),
                    "monthIncome": $(".shouru").text(),
                    "wageWaterProof": $(".wage>.checked").text()
                }
            }
            //生意人
            if (shenId == 3) {
                var dataCenter = {
                    "address": address,
                    "addressType": addressType,
                    "marriage": marriage,
                    "emergencyContact": emergencyContact,
                    "emergencyContactMobile": emergencyContactMobile,
                    "emergencyContactRelation": emergencyContactRelation,
                    "certificate": $(".xueli2").text(),
                    "companyName": $(".gongsiname2").val(),
                    "companyNature": $(".danwei2").text(),
                    "manageTime": $(".jingnianxian2").text(),
                    "businessLicense": $(".license>.checked").text(),
                    "monthIncome": $(".shouru2").text(),
                    "isBill": $(".account>.checked").text()
                }
            }
            //其他
            if (shenId == 4) {
                var dataCenter = {
                    "address": address,
                    "addressType": addressType,
                    "marriage": marriage,
                    "emergencyContact": emergencyContact,
                    "emergencyContactMobile": emergencyContactMobile,
                    "emergencyContactRelation": emergencyContactRelation,
                    "incomeSource": $(".shour>.checked").text()
                }
            }
            /*信用信息-修改*/
            $.ajax({
                url: api_sudaizhijia_host + "/v1/userinfo/identity",
                type: "post",
                dataType: "json",
                data: dataCenter,
                success: function (json) {
                    $('.landingCover').hide();
                    if (json.code == 200 && json.error_code == 0) {
                        page2Change = true;
                        $.popupCover({
                            content: '保存成功',
                            callback: function () {
                                $(".tab_box").eq(1).hide().next(".tab_box").show();
                                $(".tab_b").eq(2).addClass("spanClick").siblings().removeClass("spanClick");
                            }
                        })
                    } else {
                        alert(json.error_message);
                        return false;
                    }
                }
            })
        })
        $(".threeNext").on('click', function () {
            $('.landingCover').show();
            /*审核资料-修改*/
            $.ajax({
                url: api_sudaizhijia_host + "/v1/userinfo/certify",
                type: "post",
                dataType: "json",
                data: {
                    "zhimaCertify": $(".zhima").text(),
                    "taobaoCertify": $(".tao>.checked").text(),
                    "jingdongCertify": $(".jing>.checked").text(),
                    "peopleBankReport": $(".ren>.checked").text(),
                    "creditMoney": $(".shebao").text(),
                    "providentFundMoney": $(".gongjijin").text()
                },
                success: function (json) {
                    $('.landingCover').hide();
                    if (json.code == 200 && json.error_code == 0) {
                        page3Change = true;
                        $.popupCover({
                            content: '保存成功'
                        })
                    } else {
                        alert(json.error_message);
                    }
                }
            })
        })
    }
    /*失去焦点判断进度条*/
    blurShowLine()

    function blurShowLine() {
        /*判断text*/
        $('input[type="text"]').focus(function () {
            beforeVal = $(this).val();
        }).blur(function () {
            var afterVal = $(this).val();
            if (beforeVal == "" && afterVal != "") {
                num++;
            }
            if (beforeVal != "" && afterVal == "") {
                num--;
            }
            progressBar()
        });
        /*判断radio*/
        $('.radioIpu>label').on('click', function () {
            var brotherRadio = $(this).siblings("label");
            if (!brotherRadio.hasClass("checked") && !$(this).hasClass("checked")) {
                num++;
                progressBar()
            }
            $(this).addClass("checked").siblings("label").removeClass("checked")
        });
        /*select选择*/
        $("select").change(function () {
            var $labTex = $(this).prev("label");
            var opt = $(this).find("option:selected");
            var val = opt.text();
            var id = opt.val();
            if ($labTex.text() == "请选择" && !$labTex.hasClass('bank')) {
                num++;
                progressBar()
            }
            $labTex.text(val).css({
                "color": "#4d4d4d"
            });
            $labTex.attr("data-id", id);
        })
    }
    //银行接口
    function bankAjax() {
        $.ajax({
            url: api_sudaizhijia_host + "/v1/bank/lists",
            type: "get",
            dataType: "json",
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    var html = "";
                    $.each(json.data, function (i, b) {
                        html += "<option value=" + b.id + ">" + b.name + "</option>";
                    })
                    $(".bankSelect").append(html);
                }
            }
        })
    }
    /*基础信息-显示*/
    function showMessage() {
        $.ajax({
            url: api_sudaizhijia_host + "/v1/userinfo/basic",
            type: "get",
            dataType: "json",
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    var b = json.data;
                    if (b.real_name != "") $(".name").val(b.real_name);
                    if (b.identity_card != "") $(".shenfen").val(b.identity_card);
                    if (b.sex != "") $(".sex input").val(b.sex);
                    if (b.account != "") $(".bankCard").val(b.account);
                    if (b.name != "") $(".bank").text(b.name);
                    if (b.bank_id != "") $(".bankSelect,.bank").attr("data-id", b.bank_id)
                    if (b.alipay != "") $(".Alipay").val(b.alipay);
                    if (b.xuexin_website == "可登录") {
                        $(".xuexin>label").eq(0).addClass("checked")
                    } else if (b.xuexin_website == "无") {
                        $(".xuexin>label").eq(1).addClass("checked")
                    }
                    if (b.credit == "有") {
                        $(".credit>label").eq(0).addClass("checked")
                    } else if (b.credit == "无") {
                        $(".credit>label").eq(1).addClass("checked")
                    }
                    if (b.progCounts != "") {
                        num = b.progCounts + 1;
                    }
                    //age
                    age = b.age;
                    progressBar();
                    selColor()
                }
            }
        })
    }
    /*信用信息-显示*/
    function showInformation() {
        $.ajax({
            url: api_sudaizhijia_host + "/v1/userinfo/identity",
            type: "get",
            dataType: "json",
            success: function (json) {
                var b = json.data;
                if (json.code == 200 && json.error_code == 0) {
                    if (b.address != "") $(".address").text(b.address)
                    if (b.address_type != "") $(".addresstype").text(b.address_type)
                    if (b.marriage == "已婚") {
                        $(".married").addClass("checked")
                    } else if (b.marriage == "未婚") {
                        $(".unmarried").addClass("checked")
                    }
                    if (b.emergency_contact != "") $(".lianxiren").val(b.emergency_contact);
                    if (b.emergency_contact_mobile != "") $(".lianxirentel").val(b.emergency_contact_mobile);
                    if (b.emergency_contact_relation != "") $(".lianxirengx").text(b.emergency_contact_relation);
                    /*xuesheng*/
                    if (b.school_name != "") $(".schoolname").val(b.school_name);
                    if (b.studies != "") $(".xueye").text(b.studies);
                    if (b.graduate_long_year != "") $(".biyetime").text(b.graduate_long_year);
                    /*gongxinzu*/
                    if (b.certificate != "") $(".xueli").text(b.certificate);
                    if (b.company_name != "") $(".gongsiname").val(b.company_name);
                    if (b.company_nature != "") $(".danwei").text(b.company_nature);
                    if (b.working_years != "") $(".gongnianxian").text(b.working_years);
                    if (b.is_company_email == "有") {
                        $(".emailY").addClass("checked")
                    } else if (b.is_company_email == "无") {
                        $(".emailN").addClass("checked")
                    }
                    if (b.month_income != "") $(".shouru").text(b.month_income);
                    if (b.wage_water_proof == "有") {
                        $(".wageY").addClass("checked")
                    } else if (b.wage_water_proof == "无") {
                        $(".wageN").addClass("checked")
                    }
                    /*laoban*/
                    if (b.certificate != "") $(".xueli2").text(b.certificate)
                    if (b.company_name != "") $(".gongsiname2").val(b.company_name)
                    if (b.company_nature != "") $(".danwei2").text(b.company_nature)
                    if (b.manage_time != "") $(".jingnianxian2").text(b.manage_time)
                    if (b.business_license == "有") {
                        $(".licenseY").addClass("checked")
                    } else if (b.business_license == "无") {
                        $(".licenseN").addClass("checked")
                    }
                    if (b.month_income != "") $(".shouru2").text(b.month_income);
                    if (b.is_bill == "有") {
                        $(".accountY").addClass("checked")
                    } else if (b.is_bill == "无") {
                        $(".accountN").addClass("checked")
                    }
                    /*qita*/
                    if (b.income_source == "有") {
                        $(".shourY").addClass("checked")
                    } else if (b.income_source == "无") {
                        $(".shourN").addClass("checked")
                    }
                    selColor()
                }
            }
        })
    }
    /*审核资料-显示*/
    function showData() {
        $.ajax({
            url: api_sudaizhijia_host + "/v1/userinfo/certify",
            type: "get",
            dataType: "json",
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    var b = json.data;
                    if (b.zhima_certify != "") $(".zhima").text(b.zhima_certify)
                    if (b.people_bank_report == "可登录") {
                        $(".ren1").addClass("checked")
                    } else if (b.people_bank_report == "无") {
                        $(".ren2").addClass("checked")
                    }
                    if (b.taobao_certify == "可登录") {
                        $(".tao1").addClass("checked")
                    } else if (b.taobao_certify == "无") {
                        $(".tao2").addClass("checked")
                    }
                    if (b.jingdong_certify == "可登录") {
                        $(".jing1").addClass("checked")
                    } else if (b.jingdong_certify == "无") {
                        $(".jing2").addClass("checked")
                    }
                    if (b.credit_money != "") $(".shebao").text(b.credit_money)
                    if (b.provident_fund_money != "") $(".gongjijin").text(b.provident_fund_money)
                    selColor()
                }
            }
        })
    }
    /*智能匹配按钮*/
    $(".match").on('click', function () {
        $.ajax({
            url: api_sudaizhijia_host + "/v1/exact/data",
            type: "get",
            dataType: "json",
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    var b = json.data;
                    touse = b.to_use;
                    balanceTime = b.balance_time;
                    balance = b.balance;
                } else {
                    balance = "500"; //500
                    balanceTime = "7"; //7
                    touse = "2"; //2
                }
                local.balance = balance;
                local.balanceTime = balanceTime;
                local.touse = touse;
                hrefAjax();
            }
        });

        function hrefAjax() {
            $.ajax({
                url: api_sudaizhijia_host + "/v1/exact/completeness",
                type: "get",
                dataType: "json",
                data: {
                    "loanMoney": balance,
                    "loanTimes": balanceTime,
                    "useType": touse
                },
                success: function (json) {
                    if (json.code == 200 && json.error_code == 0) {
                        window.location.href = "/html/accurate_result.html"
                    } else if (json.error_code == 1502) {
                        if (confirm("基础信息完整才能智能匹配和领现金")) {
                            $(".tab_b").eq(0).addClass("spanClick").siblings().removeClass("spanClick");
                            $(".tab_box").eq(0).show().siblings().hide();
                        }
                    } else {
                        alert(json.error_message);
                    }
                }
            })
        }
    })
})(jQuery);
