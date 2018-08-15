var headPortrait = {
    initView: function () {
        this.initShowView();
        this.initEventView();

    },
    initShowView: function () {

    },
    initEventView: function () {
        var _this = this;
        $('#submit').on('click', function () {
            if (_this.getFileImg) {
                console.log(_this.imgSrc)
                $.ajax({
                    url: api_sudaizhijia_host + '/v1/users/photo',
                    type: "POST",
                    data: {
                        userPhoto: _this.imgSrc
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-Sign", '');
                        xhr.setRequestHeader("X-Token", localStorage.token);
                    },
                    success: function (msg) {

                    },
                    error: function (msg) {

                    }
                });
                //                service.doAjaxRequest({
                //                    url: '/v1/users/photo',
                //                    type: 'POST',
                //                    data: {
                //                        userPhoto: _this.imgSrc
                //                    },
                //                    beforeSend: function (xhr) {
                //                        xhr.setRequestHeader("X-Sign", '');
                //                        xhr.setRequestHeader("X-Token", localStorage.token);
                //                    },
                //                }, function () {}, function (json) {
                //                    $.popupCover({
                //                        content: json.error_message
                //                    })
                //                });
            }

        })
    },
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
                    width: 200
                })
                .then(function (rst) {
                    var sourceSize = toFixed2(file.size / 1024),
                        resultSize = toFixed2(rst.base64Len * 0.8 / 1024),
                        scale = parseInt(100 - (resultSize / sourceSize * 100));
                    _this.imgSrc = rst.base64;
                    $("#show_img").attr('src', _this.imgSrc);
                    _this.getFileImg = true;
                    return rst;
                });
        };
        reader.readAsDataURL(file);

        function toFixed2(num) {
            return parseFloat(+num.toFixed(2));
        }
    }

};
$(function () {
    headPortrait.initView();
});
