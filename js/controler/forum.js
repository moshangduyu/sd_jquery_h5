var forumController = {
    referer: localStorage.ClubLogin_reffre || '',
    default_clubUrl: default_clubUrl,
    initView: function () {
        localFun.doFixedNav(); //悬浮导航栏
        this.clubBindView();
        this.addEventListenerView();
    }, //
    clubBindView: function () {
        var that = this;
        $.ajax({
            type: "POST",
            url: api_sudaizhijia_host + '/v2/club/bind',
            data: {
                "referer": that.referer
            },
            timeout: 20000,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Token", localStorage.token || '');
            },
            success: function (json) {
                if (json.code == 200 && json.error_code == 0) {
                    var redirect_url = json.data.redirect_url;
                    $('iframe').attr('src', redirect_url);
                    localStorage.removeItem("ClubLogin_reffre");
                } else {
                    $('.no_network_cover').show();
                    $.popupCover({
                        content: json.error_message
                    })
                }
            },
            error: function (jqXHR, textStatus, errorMsg) {
                if (jqXHR.status == 401) {
                    $('iframe').attr('src', that.default_clubUrl + '&_status=logout');
                }
            }
        });
    }, //
    sdClubLoginView: function () {
        local.login_reffer = "/html/forum.html";
        window.location.href = "/html/login.html"
    }, //
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
