var parsePath = require('./parse_path.js');

describe('ParsePath', function() {
    it('should return object from string path input', function() {
        var path = './nutrit/page/page.inc.js';

        var file = {
            path: './nutrit/page/page.inc.js',
            dir: './nutrit/page/',
            fullName: 'page.inc.js',
            name: 'page.inc',
            base: 'page',
            ext: 'js',
            fullExt: 'inc.js'
        };
        expect(parsePath(path)).toEqual(file);
    })
});