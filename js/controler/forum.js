var forumController = {
    referer: localStorage.ClubLogin_reffre || '',
    default_clubUrl: window.location.protocol + "//club.sudaizhijia.com",
    initView: function () {
        this.checkLoginView();
        this.addEventListenerView();
    },
    //判断登录状态
    checkLoginView: function () {
        var that = this;
        if (localStorage.userId) {
            that.clubBindView();
        } else {
            if (localStorage.default_clubUrl) {
                $('iframe').attr('src', localStorage.default_clubUrl + "?c=list&from=h5");
            } else {
                $('iframe').attr('src', that.default_clubUrl + "?c=list&from=h5");
            }
            $('iframe').load(function () {
                window.frames[0].postMessage('message', '*');
            })
        }
    },
    //
    clubBindView: function () {
        var that = this;
        service.getClub({
            "referer": that.referer
        }, function (json) {
            var redirect_uri = json.data.redirect_uri;
            $('iframe').attr('src', redirect_uri);
            local.default_clubUrl = redirect_uri.substring(0, redirect_uri.indexOf('?'))
            localStorage.removeItem("ClubLogin_reffre");
        }, function (json) {
            $('.no_network_cover').show();
            $.popupCover({
                content: json.error_message
            })
        });
    },
    //
    sdClubLoginView: function () {
        local.login_reffer = "/html/forum.html";
        window.location.href = "/html/login.html"
    },
    //
    addEventListenerView: function () {
        var that = this;
        window.addEventListener('message', function (e) {
            local.ClubLogin_reffre = e.data.value;
            that.sdClubLoginView()
        }, false);
    }
};
$(function () {
    forumController.initView();
});
