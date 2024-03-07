var express = require('express');
var app = express();

var sql = require('mssql');

// Connection string parameters.
var sqlConfig = {
    user: 'sa',
    password: 'p@$$w0rd',
    server: ' 203.154.157.39',
    database: 'CFS_BKK_Freshour'
}

// Start server and listen on http://localhost:8000/
var server = app.listen(8000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
})


async function execute(query) {

    return new Promise((resolve, reject) => {

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {

            resolve(result.recordset);

            sql.close();
        }).catch(err => {

            reject(err)
            sql.close();
            
        });
    });

}

// Get query that return data from orders table
app.get('/Order', function (req, res) {
    execute('SELECT * FROM Tbl_Order;')
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})

// Get query with where
app.get('/orders/:orderID/', function (req, res) {
    execute('SELECT * FROM Tbl_Order WHERE orderID = ' + req.params.orderID)
        .then(function(value) {
            res.end(JSON.stringify(value)); // Result in JSON format
        });
})
