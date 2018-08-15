var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1261062406'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1261062406' type='text/javascript'%3E%3C/script%3E"));

function cnzz_TrackEvent(category, action, label, value, nodeid) {
    try {
        _czc.push(['_trackEvent', category, action, label, value, nodeid]);
    } catch (e) {
        console.log(e);
    }
}
//growingio
! function (e, t, n, g, i) {
    e[i] = e[i] || function () {
        (e[i].q = e[i].q || []).push(arguments)
    }, n = t.createElement("script"), tag = t.getElementsByTagName("script")[0], n.async = 1, n.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + g, tag.parentNode.insertBefore(n, tag)
}(window, document, "script", "assets.growingio.com/2.1/gio.js", "gio");
gio('init', '871cbb2df9878dde', {});
gio('send');
