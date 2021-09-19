config = {
    mongoDB: {
        URI: 'mongodb://localhost:27017/transfer-bank',
        config: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}

module.exports = config;