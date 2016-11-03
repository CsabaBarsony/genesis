module.exports = function(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    var hs = h <= 9 ? '0' + h : '' + h;
    var ms = m <= 9 ? '0' + m : '' + m;
    var ss = s <= 9 ? '0' + s : '' + s;

    return '[' + hs + ':' + ms + ':' + ss + ']';
};
