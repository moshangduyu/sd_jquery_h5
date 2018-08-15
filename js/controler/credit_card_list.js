var credit_card_list = {
    initView: function () {
        this.cardListType = $.GetQueryString('cardListType') || '';

        this.pageSize = 1;
        this.loading = false;
        this.initShowView();
        this.getNavList();
        this.getLists();
        this.scroll();
        this.initEventView();
    },
    initShowView: function () {
        var _this = this;
        //选中状态判断
        var bankName = $.GetQueryString('bankName');
        if (_this.cardListType != '') {
            if (bankName != '') {
                $('#' + _this.cardListType + '>span').text(bankName);
            };
            var id = $.GetQueryString('bankId');
            if (_this.cardListType == 'banks') {
                _this.bankId = id;
                $('.banner').show();
            } else if (_this.cardListType == 'usage') {
                _this.usageTypeNid = id;
            }
        }
    },
    initEventView: function () {
        var _this = this;
        //banner点击
        $('.banner').on('click', 'dl', function () {
            var href = $(this).data('href');
            if (localStorage.userId) {
                if (href != '') {
                    window.location.href = href;
                } else {
                    return;
                }
            } else {
                local.fromLogin = 1;
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        });
        //详情点击
        $('.content_list').on('click', '.list', function () {
            var href = $(this).data('href');

            if (localStorage.userId) {
                if (href != '') {
                    window.location.href = href;
                } else {
                    return;
                }

            } else {
                local.fromLogin = 1;
                local.login_reffer = window.location.href;
                window.location.href = "/html/login.html";
            }
        });
    },
    getNavList: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/creditcard/title',
            type: 'GET'
        }, function (obj) {
            var banksList = '',
                usageList = '',
                degreeList = '',
                feeList = '';
            $.each(obj.banks, function (i, b) {
                banksList += '<p id=' + b.id + '>' + b.bank_short_name + '</p>';
            });
            $.each(obj.usage, function (i, b) {
                usageList += '<p id=' + b.type_nid + '>' + b.name + '</p>';
            });
            $.each(obj.degree, function (i, b) {
                degreeList += '<p id=' + b.type_nid + '>' + b.name + '</p>';
            });
            $.each(obj.fee, function (i, b) {
                feeList += '<p id=' + b.type_nid + '>' + b.name + '</p>';
            });
            //nav菜单
            var checkIdx = '';
            $('.nav').on('click', 'li', function () {
                _this.idx = $(this).index();
                switch (_this.idx) {
                    case 0:
                        $('.navList').html(banksList);
                        $('#' + _this.bankId).addClass('selectStyle');
                        break;
                    case 1:
                        $('.navList').html(usageList);
                        $('#' + _this.usageTypeNid).addClass('selectStyle');
                        break;
                    case 2:
                        $('.navList').html(degreeList);
                        $('#' + _this.degree).addClass('selectStyle');
                        break;
                    case 3:
                        $('.navList').html(feeList);
                        $('#' + _this.feeTypeNid).addClass('selectStyle');
                        break;
                };
                if (_this.idx !== checkIdx) {
                    $('.navList_box').show();
                    $('.navList').slideDown(300);
                    checkIdx = _this.idx;
                } else {
                    $('.navList').slideUp(300, function () {
                        $('.navList_box').hide();
                    });
                    checkIdx = '';
                }
            });
            $('.navList').on('click', 'p', function () {
                $(this).addClass('selectStyle').siblings('p').removeClass('selectStyle');
                var showText = $(this).text();
                $('.navList').slideUp(300, function () {
                    $('.navList_box').hide();
                });
                checkIdx = '';
                switch (_this.idx) {
                    case 0:
                        $('#banks>span').text(showText);
                        _this.bankId = $(this).attr('id');
                        if (_this.bankId == 0) {
                            $('.banner').hide();
                        } else {
                            $('.banner').show();
                        }
                        break;
                    case 1:
                        $('#usage>span').text(showText);
                        _this.usageTypeNid = $(this).attr('id');
                        break;
                    case 2:
                        $('#degree>span').text(showText);
                        _this.degree = $(this).attr('id');
                        break;
                    case 3:
                        $('#fee>span').text(showText);
                        _this.feeTypeNid = $(this).attr('id');
                        break;
                };
                _this.pageSize = 1;
                _this.loading = false;
                _this.getLists();
            });

        });
    },
    //列表
    getLists: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/banks/creditcard/filters',
            type: 'GET',
            data: {
                deviceId: '',
                bankId: _this.bankId || '',
                usageTypeNid: _this.usageTypeNid || '',
                degree: _this.degree || '',
                feeTypeNid: _this.feeTypeNid || '',
                pageSize: _this.pageSize,
                pageNum: 10
            }
        }, function (obj) {
            var html = '';
            if (obj.list.length > 0) {
                $.each(obj.list, function (i, b) {
                    html += '<div class="list" data-href="' + b.card_h5_link + '">' +
                        '<dl class="res_top"><dt><img src=' + b.card_logo + '></dt>' +
                        '<dd>' +
                        '<h3>' + b.card_name + '</h3>' +
                        '<p class="p1">' + b.activity_content + '</p>' +
                        '<em class="rightIcon"></em>' +
                        '</dd>' +
                        '</dl>' +
                        '<div class="res_btm">' +
                        '<p><img src="../img/credit_card_elected_listIcon.png"><span>本月<b>' + b.total_apply_count + '</b>申请</span></p>' +
                        '</div>' +
                        '</div>';
                });
                if (_this.loading) {
                    $(".content_list").append(html);
                } else {
                    $(".content_list").html(html);
                }
                if (obj.pageCount > 1) {
                    $('#PullUp').html('<img src="../img/rolling.svg" alt="">努力加载中');
                } else if (obj.pageCount == 1) {
                    $('#PullUp').show().html('已加载全部');
                }
                _this.pageCode = obj.pageCount;
                _this.pageSize++;
            } else {
                $(".content_list").html('');
                $('#PullUp').show().html('已加载全部');
            };
            if (obj.banks != '') {
                $('.banner').html('<dl data-href="' + obj.banks.all_link + '">' +
                    '<dt><img src=' + obj.banks.bank_logo + ' alt=""></dt>' +
                    '<dd>' +
                    '<h3>' + obj.banks.bank_short_name + '</h3>' +
                    '<p>' + obj.banks.bank_desc + '</p>' +
                    '<h6>通过率：<span style="margin-right:.5rem">' + obj.banks.pass_rate_type + '</span>批卡速度：<span>' + obj.banks.approve + '</span></h6>' +
                    '</dd>' +
                    '</dl>');
            } else {
                $('.banner').hide();
            }


        }, function () {
            $('.content_list').html("<div class='noshou'><img src='../img/no_products_icon.png' alt=''></div>");
            $('#PullUp').show().html('暂无筛选产品');
        });
    },
    scroll: function () {
        var _this = this;
        $(window).scroll(function () {　
            //判断滚动到底部
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_this.pageSize <= _this.pageCode) {
                    _this.loading = true;
                    setTimeout(function () {
                        _this.getLists();
                    }, 300)
                } else {
                    $('#PullUp').show().html('已加载全部');
                }
            }
        });
    }
};
$(function () {
    credit_card_list.initView();
})
