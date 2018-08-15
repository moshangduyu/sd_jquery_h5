var sd_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
var host = window.location.host;
var arr = host.split(".");
var host_href = arr[arr.length - 2];
if (host == "m." + host_href + ".com") {
    api_sudaizhijia_host = sd_protocol + "api.sudaizhijia.com";
    m_sudaizhijia_host = sd_protocol + "m.sudaizhijia.com";
    we_landing = sd_protocol + "event.sudaizhijia.com/m/landing/index.html";
    default_clubUrl = sd_protocol + "sns.sudaizhijia.com/m/index.php?s=/club/index/index.html";
}
else {
    api_sudaizhijia_host = sd_protocol + "uat.api.sudaizhijia.com";
    m_sudaizhijia_host = sd_protocol + "uat.m.sudaizhijia.com";
    we_landing = sd_protocol + "uat.event.sudaizhijia.com/m/landing/index.html";
    default_clubUrl = sd_protocol + "uat.sns.sudaizhijia.com/m/index.php?s=/club/index/index.html";
    document.write('<script src="../js/vconsole.min.js"></script>');
}
