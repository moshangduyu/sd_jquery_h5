var minePoints = {
    initView: function () {
        this.status = 2;
        this.pageSize = 1;
        this.title_date = '';
        this.selectChange();
        this.handleScroll();
        this.getList();
        this.integral_mall_btn();
    }
    , //selsect选项
    selectChange: function () {
        var _this = this;
        $('.selece_nav').change(function () {
            var selstc_content = $(this).find("option:selected").text();
            $('.selstc_content').text(selstc_content);
            $('#fixed_content_title').hide();
            _this.status = $(this).find("option:selected").val();
            _this.title_date = '';
            _this.loading = false;
            _this.pageSize = 1;
            _this.getList();
        })
    }
    , //数据展示
    getList: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v2/credit'
            , type: 'GET'
            , data: {
                status: _this.status
                , pageSize: _this.pageSize
                , pageNum: 10
            }
        }, function (obj) {
            $('.mine_points').text(obj.userScore)
            var html = '';
            if (obj.list != '') {
                $.each(obj.list, function (i, b) {
                    if (b.title_date != _this.title_date) {
                        if (b.current == true) {
                            html += '<h3 class="content_title" id=' + b.title_date + '>' + '<span class="time">本月</span>';
                        }
                        else {
                            html += '<h3 class="content_title" id=' + b.title_date + '>' + '<span class="time">' + b.month + '</span>';
                        }
                        if (_this.status == 0) {
                            html += '<span class="spend">花积分：<b>0</b></span>' + '</h3>';
                        }
                        else if (_this.status == 1) {
                            html += '<span class="earn">赚积分：<b>0</b></span>' + '</h3>';
                        }
                        else {
                            html += '<span class="spend">花积分：<b>0</b></span>' + '<span class="earn">赚积分：<b>0</b></span>' + '</h3>';
                        }
                        _this.title_date = b.title_date;
                    };
                    if (b.type_nid != '') {
                        html += '<p><span>' + b.name + '<br><i>' + b.date + '</i></span><b>' + b.score + '</b></p>';
                    }
                });
                if (_this.loading) {
                    $(".main_content").append(html);
                }
                else {
                    $(".main_content").html(html);
                }
                $.each(obj.total, function (i, b) {
                    $('#' + b.month).find('.spend>b').text(b.expend);
                    $('#' + b.month).find('.earn>b').text(b.income);
                });
                _this.pageCode = obj.pageCount;
                _this.pageSize++;
                if (_this.pageCode <= 1) {
                    $('#PullUp').show().html('已加载全部');
                }
                else {
                    $('#PullUp').show().html('<img src="../img/rolling.svg" alt="">努力加载中');
                }
            }
            else {
                $.popupCover({
                    content: '暂无积分记录'
                });
                $(".main_content").html('');
                $('#PullUp').show().html('已加载全部');
            }
        });
    }
    , //scroll事件
    handleScroll: function () {　　　
        var _this = this;
        var selectNavTop = $('.selectNav').offset().top - $('header').height();
        //监听滚动
        $(window).scroll(function () {　
            //判断滚动到底部-分页加载
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_this.pageSize <= _this.pageCode) {
                    _this.loading = true;
                    setTimeout(function () {
                        _this.getList();
                    }, 300)
                }
                else {
                    $('#PullUp').html('已加载全部');
                }
            };
            //固定select
            if ($(window).scrollTop() >= selectNavTop) {
                $('#fixed_selectNav').show();
            }
            else {
                $('#fixed_selectNav').hide();
            };
            //固定title
            var titleOffsetTop = $('header').height() + $('.selece_nav').height();
            var fistTitleTop = $('.main_content').offset().top - titleOffsetTop;
            $.each($('.content_title'), function (i, b) {
                var title_top = $(this).offset().top - titleOffsetTop;
                var time = $(this).find('.time').text();
                var spend = $(this).find('.spend>b').text();
                var earn = $(this).find('.earn>b').text();
                if ($(window).scrollTop() >= title_top) {
                    $('.spend,.earn').show();
                    if (_this.status == 1) {
                        $('#fixed_content_title>.spend').hide();
                    }
                    else if (_this.status == 0) {
                        $('#fixed_content_title>.earn').hide();
                    }
                    $('#fixed_content_title').show();
                    $('#fixed_content_title>.time').text(time);
                    $('#fixed_content_title>.spend>b').text(spend);
                    $('#fixed_content_title>.earn>b').text(earn);
                }
                else if ($(window).scrollTop() <= fistTitleTop) {
                    $('#fixed_content_title').hide();
                }
            })
        });
    }
    , //积分点击
    integral_mall_btn: function () {
        $('.integral_mall_btn').on('click', function () {
            //判断ios
            if (Terminal.platform.iPhone) {
                service.getShop({
                    "redirect": ''
                }, function (obj) {
                    window.location.href = obj.redirect_url;
                }, function (json) {
                    $.popupCover({
                        content: json.error_message
                    })
                });
            }
            else {
                window.location.href = "/html/integral_mall.html";
            }
        });
    }
};
$(function () {
    minePoints.initView();
});