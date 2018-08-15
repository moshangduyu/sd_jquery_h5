var address = {
    BANNER_LIST: host + '/v1/banner'
, };
var store = {};
var cookie = {
    getPlatFrom: function () {}
};
var service = {
    getBannerList: function (success, error) {
        $.ajax({
            url: address.BANNER_LIST
            , method: 'POST'
            , success: function (data) {
                if (success.error_code == 0) {
                    success(data.data);
                }
                else {}
            }
            , error: function (data) {
                error(data);
            }
            , finish: function () {
                success(data);
            }
        });
    }
    , getProductList: function (data, success, error) {
        // body...
    }
};
var indexControler = {
    search_text: 'abc'
    , initViews: function () {
        this.onSearch();
    }
    , onSearch: function () {
        $('#search_product').on('click', function (e) {
            var search = $('#search_text').val();
            this.doSearch(search);
        });
    }
    , doSearch: function (data) {
        service.getBannerList({
            'search': search
        }.function(data) {
            for (var i = data.length - 1; i >= 0; i--) {
                Things[i]
            }
        }, $.empty);
    }
};
indexControler.initViews();
// 原型方式
var serviceBase = function () {}
serviceBase.prototype.doAjax = function () {
    // body...
};
new serviceBase();