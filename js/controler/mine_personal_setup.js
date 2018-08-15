var mineSetupController = {
    initEventView: function () {
        var that = this;
        //判断是否显示退出登录
        if (localStorage.userId) {
            $("#back").show().click(function () {
                if (confirm("是否要退出登录？")) {
                    var default_clubUrl = localStorage.default_clubUrl;
                    localStorage.clear();
                    local.default_clubUrl = default_clubUrl;
                    window.location.href = "/index.html";
                }
            })
        };
        //关于速贷之家跳转
        $(".aboutour").click(function () {
            window.location.href = "mine_aboutour.html?from=1"
        });
        //商务合作
        $(".cooperation").click(function () {
            window.location.href = "cooperation.html?from=1"
        });
        //修改密码
        $.LogonStatusEvent($(".changemima"), function () {
            window.location.href = "/html/mine_changemima2.html";
        }, function () {
            local.backHref = document.referrer;
        });
    }
};
$(function () {
    mineSetupController.initEventView()
});
