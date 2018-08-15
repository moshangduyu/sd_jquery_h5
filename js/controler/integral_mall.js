var integralMall = {
    initView: function () {
        this.integralBindView();
        this.addEventListenerView();
    },
    //
    integralBindView: function () {
        var _this = this;
        if (localStorage.ClubLogin_reffre) {
            var ClubLogin_reffre = localStorage.ClubLogin_reffre;
            localStorage.removeItem('ClubLogin_reffre');
            $('.backBtn').on('click', function () {
                window.location.href = "/html/mine.html";
            });
        } else {
            var ClubLogin_reffre = '';
            $('.backBtn').on('click', function () {
                javasceipt: history.back();
            });
        }
        service.getShop({
            "redirect": ClubLogin_reffre
        }, function (obj) {
            var redirect_url = obj.redirect_url;
            $('iframe').attr('src', redirect_url);
        }, function (json) {
            $('.no_network_cover').show();
            $.popupCover({
                content: json.error_message
            })
        });
    },
    sdClubLoginView: function () {
        local.login_reffer = "/html/integral_mall.html";
        window.location.href = "/html/login.html"
    },
    //
    addEventListenerView: function () {
        var _this = this;
        $('iframe').load(function () {
            window.frames[0].postMessage('login', '*');
        })

        window.addEventListener('message', function (e) {
            local.ClubLogin_reffre = e.data.value;
            _this.sdClubLoginView();
        }, false);
    }
};
$(function () {
    integralMall.initView();
});
