var Jasmine = require('jasmine'),
    jasmine = new Jasmine();

global._ = require('lodash');

jasmine.loadConfig({
    'spec_files': [
        'client/**/*.test.js',
        'server/**/*.test.js'
    ],
    'stopSpecOnExpectationFailure': false,
    'random': false
});

jasmine.execute();
