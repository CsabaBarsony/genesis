var browserify = require('browserify');
var fs         = require('fs-extra');
var glob       = require('glob');
var pug        = require('pug');
var sass       = require('node-sass');

var parsePath = require('./parse_path');
var time      = require('./time');

var tasks = {
    createPages: function() {
        glob.sync('./client/pages/**/*.jsx').map(function(path) {
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
        glob.sync('./client/pages/**/*.pug').map(function(path) {
            var file = parsePath(path);
            var dest = './public/' + file.name + '.html';

            var html = pug.renderFile(path, { pretty: true });

            fs.writeFile(dest, html, function(error) {
                writeReady(error, dest);
            });
        })
    },
    createStyles: function() {
        glob.sync('./client/components/**/*.scss').map(function(path) {
            var file = parsePath(path);
            var style = sass.renderSync({ file: path });
            var dest = './public/css/' + file.name + '.css';

            fs.writeFile(dest, style.css, function(error) {
                writeReady(error, dest);
            })
        });
    }
};

var compiler = {
    init: function() {
        fs.removeSync('./public/*.html');
        fs.removeSync('./public/js/*.js');
        fs.removeSync('./public/css/*.css');
        tasks.createPages();
        tasks.createMarkups();
        tasks.createStyles();
    }
};

function writeReady(error, path) {
    if(error) console.error(time(new Date()), __filename, error);
    else console.log(time(new Date()) + ' write ready: ' + path);
}

module.exports = compiler;
