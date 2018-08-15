var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1261062406'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1261062406' type='text/javascript'%3E%3C/script%3E"));

function cnzz_TrackEvent(category, action, label, value, nodeid) {
    try {
        _czc.push(['_trackEvent', category, action, label, value, nodeid]);
    } catch (e) {
        console.log(e);
    }
}
