module.exports = function parsePath(path) {
    var unixStylePath = path.replace(/\\/g, '/');
    var folderArr = /(.*?)([^\/]*$)/.exec(unixStylePath);
    var fileArr = /(.*?)\.([^\.]*)$/.exec(folderArr[2]);
    var extArr = /\.(.*)/.exec(folderArr[2]);
    var baseArr = /^[^\.]+/.exec(fileArr[0])

    return {
        path: unixStylePath,
        dir: folderArr[1],
        fullName: fileArr[0],
        name: fileArr[1],
        base: baseArr[0],
        ext: fileArr[2],
        fullExt: extArr[1]
    };
};
