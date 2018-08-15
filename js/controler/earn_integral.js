var earnIntegral = {
    initView: function () {
        this.data();

    },
    data: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/credit/increase',
            type: 'GET'
        }, function (obj) {
            $('.mine_points').text(obj.income);
            $.each(obj.list, function (i, b) {
                $('.main>dl').eq(i).find('.score').text(b.score);
                $('.main>dl').eq(i).find('a').attr('data-status', b.credit_sign);
            });
            if ($('.portraitBtn').data('status') == 1) {
                $('.portraitBtn').text('已完成')
            }
            if ($('.nameBtn').data('status') == 1) {
                $('.nameBtn').text('已完成')
            }
            if ($('.signBtn').data('status') == 1) {
                $('.signBtn').text('已签到')
            }
            _this.event();
        });
    },
    event: function () {
        $('.registerBtn,.portraitBtn,.nameBtn').on('click', function () {
            var status = $(this).data('status');
            var prompt = $(this).data('prompt');
            if (status == 1) {
                $(this).attr('href', 'javascript:');
                $.popupCover({
                    content: prompt
                })
            }
        });
        $('.signBtn').on('click', function () {
            var status = $(this).data('status');
            if (status == 1) {
                return;
            } else {
                service.doAjaxRequest({
                    url: '/v1/sign',
                    type: 'GET'
                }, function (obj) {
                    $.popupCover({
                        content: '签到成功!',
                        callback: function () {
                            window.location.reload();
                        }
                    })
                }, function (obj) {
                    $.popupCover({
                        content: obj.error_message
                    })
                });
            }
        })
    }
};
$(function () {
    earnIntegral.initView();
});
