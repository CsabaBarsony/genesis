var browserify = require('browserify');
var fs         = require('fs-extra');
var glob       = require('glob');
var pug        = require('pug');

var parsePath = require('./parse_path');
var time      = require('./time');

var compiler = {
    createPages: function() {
        glob.sync('./src/pages/**/*.jsx').map(function(path) {
            var file = parsePath(path);
            var dest = './public/js/' + file.name + '.js';

            var stream = browserify(path, { debug: true })
                .transform('babelify', { presets: ['es2015', 'react']})
                .on('error', function(error) { if(error) console.error(__filename, error); })
                .on('finish', function(error) { writeReady(error, dest); })
                .bundle()
                .pipe(fs.createWriteStream(dest));

            stream.on('finish', function(error) {
                writeReady(error, dest);
            });
        });
    },
    createMarkups: function() {
        glob.sync('./src/pages/**/*.pug').map(function(path) {
            var file = parsePath(path);
            var dest = './public/' + file.name + '.html';

            var html = pug.renderFile(path, { pretty: true });

            fs.writeFile(dest, html, function(error) {
                writeReady(error, dest);
            });
        })
    }
};

var compile = function() {

};

compiler.createPages();
compiler.createMarkups();

function writeReady(error, path) {
    if(error) console.error(time(new Date()), __filename, error);
    else console.log(time(new Date()) + ' write ready: ' + path);
}

module.exports = compile;
