// module.exports = {
//     url: 'mongodb://localhost:27017/express_test'    
// }

module.exports = function() {
    return config = {
        "dbName": "express_test",
        "connection": "mongodb://127.0.0.1/",
        "authSource": "?authSource=hitesh"
    }
}();