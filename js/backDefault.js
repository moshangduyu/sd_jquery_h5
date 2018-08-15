/*js禁止浏览器，微信，及手机物理键的返回*/
XBack = {};
(function (XBack) {
    XBack.STATE = 'x-back';
    XBack.element;
    XBack.onPopState = function (event) {
        event.state === XBack.STATE && XBack.fire();
        XBack.record(XBack.STATE); //初始化事件时，push一下

    };
    XBack.record = function (state) {
        history.pushState(state, null, location.href);
    };
    XBack.fire = function () {
        var event = document.createEvent('Events');
        event.initEvent(XBack.STATE, false, false);
        XBack.element.dispatchEvent(event);
    };
    XBack.listen = function (listener) {
        XBack.element.addEventListener(XBack.STATE, listener, false);

    };
    XBack.init = function () {
        XBack.element = document.createElement('span');
        window.addEventListener('popstate', XBack.onPopState);
        XBack.record(XBack.STATE);
    };
})(XBack);

