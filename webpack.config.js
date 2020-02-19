module.exports = {
    entry: {
        app: './src/spa.js'
    },
    output: {
        path: `${__dirname}/public/js`,
        filename: '[name].bundle.js'
    }
};