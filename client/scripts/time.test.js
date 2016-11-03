var time = require('./time.js');

describe('Time', function() {
    it('should return nice, short time format', function() {
        var testset = [
            {
                in: new Date(2016, 10, 1, 7, 25, 56, 0),
                out: '[07:25:56]'
            },
            {
                in: new Date(2016, 10, 1, 17, 1, 56, 0),
                out: '[17:01:56]'
            },
            {
                in: new Date(2016, 10, 1, 7, 25, 9, 0),
                out: '[07:25:09]'
            }
        ];

        testset.map(function(t) {
            expect(time(t.in)).toBe(t.out);
        });
    })
});