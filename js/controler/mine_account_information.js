var mineAccount = {
    initView: function () {
        this.initShowView();
        this.selectChange();
    },
    initShowView: function () {
        var _this = this;
        service.doAjaxRequest({
            url: '/v1/users/info',
            type: 'GET'
        }, function (b) {
            //头像
            if (b.user_photo != '') {
                _this.cropImg(b.user_photo);
            } else {
                $('#show_img').css({
                    "background-image": "url(../img/sudaidai.png)",
                    "background-size": '1.1rem 1.1rem'
                })
            };
            //身份
            switch (Number(b.indent)) {
                case 1:
                    $('.indent>span').text('学生党');
                    break;
                case 2:
                    $('.indent>span').text('上班族');
                    break;
                case 3:
                    $('.indent>span').text('生意人');
                    break;
                case 4:
                    $('.indent>span').text('自由职业');
                    break;
            };
            if (b.is_username == 0) {
                $('.username>span').html('添加');
            } else if (b.is_username == 1) {
                $('.username>span').html(b.username);
            };
            $('.username>span').on('click', function () {
                window.location.href = "mine_change_username.html?source=1";
            });
            $('.phone>span').text(b.mobile);
        })
    },
    //图片裁剪
    cropImg: function (user_photo) {
        $('#hide_img').attr('src', user_photo);
        $("#hide_img").load(function () {
            var imgW = $('#hide_img').width(),
                imgH = $('#hide_img').height();
            if (imgW > imgH) {
                $('#show_img').css({
                    "background-image": "url(" + user_photo + ")",
                    "background-size": 'auto 1.1rem'
                })
            } else if (imgW < imgH) {
                $('#show_img').css({
                    "background-image": "url(" + user_photo + ")",
                    "background-size": "1.1rem auto"
                })
            } else {
                $('#show_img').css({
                    "background-image": "url(" + user_photo + ")",
                    "background-size": "1.1rem 1.1rem"
                })
            }
        })

    },
    //身份修改
    selectChange: function () {
        var _this = this;
        $('select').change(function () {
            _this.indent = $(this).find("option:selected").val();
            $('.indent>span').text($(this).find("option:selected").text());
            service.doAjaxRequest({
                url: '/v1/users/identity',
                type: 'POST',
                data: {
                    "identity": _this.indent
                }
            }, function () {
                local.indent = _this.indent;
                local.screenIdentIdx = _this.indent;
            })
        })
    },
    //图片上传
    getFile: function (fileDom) {
        var _this = this;
        //判断是否支持FileReader
        if (window.FileReader) {
            var reader = new FileReader();
        } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            return false;
        }
        //获取文件
        var file = fileDom.files[0];
        var imageType = /^image\//;
        //是否是图片
        if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
        }
        //读取完成
        reader.onload = function (e) {
            lrz(file, {
                    width: '100%'
                })
                .then(function (rst) {
                    //                    var filea = rst.formData.get('file');
                    //                    rst.formData.append('fileLen', rst.fileLen);
                    //                    rst.formData.append('userPhoto', filea);
                    //                    rst.formData.delete('file');
                    $.ajax({
                        url: api_sudaizhijia_host + '/v2/users/photo',
                        data: rst.formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("X-Sign", '');
                            xhr.setRequestHeader("X-Token", localStorage.token);
                        },
                        success: function (obj) {
                            if (obj.code == 200 && obj.error_code == 0) {
                                _this.cropImg(obj.data.photo);
                                $.popupCover({
                                    content: '提交成功！'
                                })

                            } else {
                                $.popupCover({
                                    content: obj.error_message
                                })
                            }
                        },
                        error: function (msg) {

                        }
                    });

                }).catch(function (err) {
                    alert(err);
                });

        };
        reader.readAsDataURL(file);

        function toFixed2(num) {
            return parseFloat(+num.toFixed(2));
        }
    },
    //////////////////////////////////////////
    //初始化图片上传
    formData: function (fileDom) {
        var _this = this;
        //判断是否支持FileReader
        if (window.FileReader) {
            var reader = new FileReader();
        } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            return false;
        }
        //获取文件
        var file = fileDom.files[0];
        var imageType = /^image\//;
        //是否是图片
        if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
        }
        //限制大小
        //        var maxSize = 2 * 1024 * 1024;
        //        if (file.size > maxSize) {
        //            alert("图片大小不能超过 2MB!");
        //            return;
        //        }
        $.ajax({
            url: api_sudaizhijia_host + '/v1/users/photo',
            type: "POST",
            data: new FormData($('#form-upload')[0]),
            dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Sign", '');
                xhr.setRequestHeader("X-Token", localStorage.token);
            },
            success: function (obj) {
                if (obj.code == 200 && obj.error_code == 0) {
                    $.popupCover({
                        content: '提交成功！',
                        callback: function () {
                            _this.cropImg(obj.data.photo);
                        }
                    })

                } else {
                    $.popupCover({
                        content: obj.error_message
                    })
                }

            }
        });

    }
};

$(function () {
    mineAccount.initView();
});
