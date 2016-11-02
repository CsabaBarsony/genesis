var Jasmine = require('jasmine'),
    jasmine = new Jasmine();

global._ = require('lodash');

jasmine.loadConfig({
    'spec_files': [
        'scripts/**/*.test.js',
        'server/**/*.test.js',
        'src/**/*.test.js'
    ],
    'stopSpecOnExpectationFailure': false,
    'random': false
});

jasmine.execute();
