var mysql = require('mysql'),
    database;

if(!process.env.NODE_IP) {
    database = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nutrit'
    });
}
else {
    database = mysql.createConnection({
        host: '127.7.69.130',
        user: 'adminQKzlKgB',
        password: 'Z4e96cERn3P2',
        database: 'nutrit'
    });
}


module.exports = {
    connect: function() {
        database.connect();
        return {
            foods: {
                getByCategory: function(category, callback) {
                    database.query('select * from nutrients where category = \'' + category + '\'', function(error, rows) {
                        if(error) console.log(error);
                        callback(error, rows);
                    });
                }
            }
        }
    }
};
