function downlinkmax() {
    var limitless = Infinity
        , nav = navigator
        , speed
        , connection = nav.connection || nav.mozConnection || nav.webkitConnection || {
            downlinkMax: limitless
        };
    if (!('downlinkMax' in connection)) {
        if ('bandwidth' in connection) {
            connection.downlinkMax = connection.bandwidth * 8;
        }
        else {
            switch (connection.type) {
            case 'none':
                speed = 0;
                break;
            case '2g':
                speed = 0.134;
                break;
            case 'bluetooth':
            case 'cellular':
                speed = 2;
                break;
            case '3g':
                speed = 8.95;
                break;
            case '4g':
                speed = 100;
                break;
            case 'ethernet':
                speed = 550;
                break;
            case 'wifi':
                speed = 600;
                break;
            default:
                speed = limitless;
                break;
            }
            connection.downlinkMax = speed;
        }
    }
    return connection.downlinkMax;
}
alert(downlinkmax())