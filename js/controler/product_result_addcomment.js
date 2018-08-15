var addCommentController = {
    initView: function () {
        /*截取地址栏信息*/
        this.productId = $.GetQueryString("productId");
        this.placeholder = '分享经验有积分哦~\n提意见将直接反馈给本出借平台~';
        this.doStarView();
        this.doTextareaView();
        this.doSubmitView();
    },
    //评论查询展示
    doCommentShowView: function (obj) {
        //显示顶部产品
        $(".top_dl").attr("data-id", obj.platform_id);
        $(".top_dl img").attr('src', obj.product_logo);
        $(".top_dl dd").text(obj.platform_product_name);
        //显示申请状态数组
        var result_listHtml = '';
        $.each(obj.result_list, function (i, b) {
            result_listHtml += '<span id=' + b.result_id + ' class="state_span">' + b.result_name + '</span>';
        });
        $('.addcomment_state>div').html(result_listHtml);
        //绑定产品最大最小额度
        $('.money').attr('loan_min', obj.loan_min);
        $('.money').attr('loan_max', obj.loan_max);
        $('.money').attr('placeholder', obj.loan_min + '~' + obj.loan_max);
        /*tab点击*/
        $(".addcomment_state span").click(function () {
            var idx = $(this).index();
            $(this).addClass("addZhuangtai").siblings().removeClass("addZhuangtai");
            $('.state_box').eq(idx).show().siblings('.state_box').hide();
            //清楚已填写信息
            $('.money').val('');;
            $('.addcomment_time_box>span').removeClass('addTimeStatus');
            $('.starNum').text('');
            $('.product_xing>i').css({
                'background': 'url("/img/%E6%98%9F-%E5%A4%A72.png")',
                "background-size": "100% 100%"
            });
            $('.addcom_taxtarea').val(addCommentController.placeholder).css({
                color: '#999'
            });
            $('.addcomment_btm span').text('0');
        });
        //显示审批时间
        var timeList = '';
        $.each(obj.apply_time_list, function (i, b) {
            timeList += '<span data-id=' + b.value + ' class="state_span ' + b.value + '">' + b.name + '</span>';
        });
        $('.addcomment_time_box').html(timeList);
        $('.addcomment_time_box>span').click(function () {
            $(this).addClass("addTimeStatus").siblings().removeClass("addTimeStatus");
        });
        //判断显示评论状态对应内容
        var result = Number(obj.result);
        if (result == 0) {
            $("header b,.product_result_addcomment_btm").text("添加评论");
            $("title").text("速贷之家-添加评论");
            $(".addcomment_state span").eq(0).addClass("addZhuangtai");
            $(".state_box").eq(0).show();
            $('.addcom_taxtarea').val(addCommentController.placeholder);
        } else {
            $("header b,.product_result_addcomment_btm").text("修改评论");
            $("title").text("速贷之家-修改评论");
            $('#' + result).addClass("addZhuangtai");
            //显示申请状态
            switch (result) {
                case 7:
                    $(".state_box").eq(0).show();
                    commentData(0);
                    break;
                case 2:
                    $(".state_box").eq(1).show();
                    commentData(1);
                    break;
                case 4:
                    $(".state_box").eq(2).show();
                    commentData(2);
                    break;
                case 6:
                    $(".state_box").eq(3).show();
                    commentData(3);
                    break;
            }
            //渲染显示数据
            function commentData(idx) {
                var $this = $(".state_box").eq(idx);
                //显示额度
                $this.find('.money').val(obj.loan_money);
                //显示审批时间
                var applyTime = obj.apply_time;
                $this.find('.' + obj.apply_time).addClass('addTimeStatus');
                //显示综合满意度
                $this.find('.starNum').text(obj.experience);
                var $i = $this.find(".product_xing i"),
                    idx = $this.find(".starNum").text();
                if (idx == 0) {
                    $i.css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A72.png')",
                        "background-size": "100% 100%"
                    })
                } else {
                    $i.eq(idx - 1).css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                        "background-size": "100% 100%"
                    });
                    $i.eq(idx - 1).prevAll().css({
                        "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                        "background-size": "100% 100%"
                    })
                }
                //显示反馈
                $this.find("textarea").val(obj.content);
                $this.siblings('.state_box').find('textarea').val(addCommentController.placeholder);
                var leng = $(".addcom_taxtarea").val().length;
                $this.find(".textNum").text(leng);
            }
        };


    },
    //星星点击效果
    doStarView: function () {
        var $xingI = $(".product_xing i");
        $xingI.click(function () {
            var num = $(this).index() + 1;
            $(this).css({
                "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                "background-size": "100% 100%"
            });
            $(this).prevAll().css({
                "background": "url('../img/%E6%98%9F-%E5%A4%A71.png')",
                "background-size": "100% 100%"
            });
            $(this).nextAll().css({
                "background": "url('../img/%E6%98%9F-%E5%A4%A72.png')",
                "background-size": "100% 100%"
            });
            $(this).parent().next("b").text(num);
        });
    },
    //文本域输入显示
    doTextareaView: function () {
        $('textarea').focus(function () {
            if ($(this).val() == addCommentController.placeholder) {
                $(this).val('');
            }
        });
        $('textarea').blur(function () {
            if ($.trim($(this).val()) == '') {
                $(this).val(addCommentController.placeholder).css({
                    "color": "#999"
                });
            }
        });
        /*文本域输入*/
        $(".addcom_taxtarea").bind("input propertychange", function () {
            var leng = $(this).val().length;
            $(this).css({
                "color": "#4d4d4d"
            })
            $(this).next("p").find("span").text(leng);
        });
    },
    //提交
    doSubmitView: function () {
        $(".product_result_addcomment_btm").click(function () {
            var platformId = $(".top_dl").data("id"),
                $parent = $(this).parents('.state_box'),
                result = Number($(".addZhuangtai").attr("id")),
                loanMoney = Number($parent.find(".money").val()),
                loanMin = Number($(".money").attr('loan_min')),
                loanMax = Number($(".money").attr('loan_max')),
                timeIdx = $parent.find(".addTimeStatus").data('id'),
                experience = $parent.find('.starNum').text() || 0,
                textareaContent = $.trim($parent.find("textarea").val());
            var checkSubmit = {
                //判断额度
                moneyFun: function () {
                    var moneyZ = /^(0|[1-9][0-9]*)$/;
                    if (!moneyZ.test(loanMoney) || loanMoney < loanMin || loanMoney > loanMax) {
                        $.popupCover({
                            content: '请输入正确的额度数据'
                        });
                        return false;
                    } else {
                        this.timeFun();
                    }
                },
                //判断时间
                timeFun: function () {
                    if (timeIdx === undefined) {
                        $.popupCover({
                            content: '审批时间要选择哦~'
                        });
                        return false;
                    } else {
                        this.starFun();
                    }
                },
                //判断星星
                starFun: function () {
                    if (experience == 0) {
                        $.popupCover({
                            content: '星星是要选的哦~'
                        });
                        return false;
                    } else {
                        this.textarea();
                    }
                },
                //判断意见反馈
                textarea: function () {
                    if (textareaContent == addCommentController.placeholder || textareaContent == "") {
                        if (result === 7) {
                            textareaContent = '我已成功获得借款审批，金额' + loanMoney + '元!';
                        } else {
                            $.popupCover({
                                content: '评论将被万千借友看到，请您写一点吧~'
                            });
                            return false;
                        }
                    };
                    service.doAjaxRequest({
                        url: '/v3/comment',
                        type: 'POST',
                        data: {
                            "platformId": platformId,
                            "productId": addCommentController.productId,
                            "content": textareaContent,
                            "loanMoney": loanMoney,
                            "experience": experience,
                            "resultId": result,
                            "applyTime": timeIdx
                        }
                    }, function () {
                        /*提交弹出框*/
                        $.popupCover({
                            content: "提交成功",
                            callback: function () {
                                window.location.href = document.referrer;
                            }
                        });
                    }, function (json) {
                        alert(json.error_message);
                    })

                }
            };
            switch (result) {
                case 7:
                    checkSubmit.moneyFun();
                    break;
                case 2:
                    checkSubmit.timeFun();
                    break;
                case 4:
                    checkSubmit.starFun();
                    break;
                case 6:
                    checkSubmit.starFun();
                    break;
            };
        })
    }
};
$(function () {
    addCommentController.initView();
    //评论查询展示
    service.doAjaxRequest({
        url: '/v3/comment/before',
        type: 'GET',
        async: false,
        data: {
            "productId": addCommentController.productId
        }
    }, function (obj) {
        addCommentController.doCommentShowView(obj);
    });
});
