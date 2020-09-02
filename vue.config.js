const webpack = require("webpack");
module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    devServer:{
        proxy:{
            '^/': {
                target: 'http://127.0.0.1:8070',
                ws: true,
                changeOrigin: true
            }
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '开封国际艺术品保税仓'
                return args
            })
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                "window.Quill": "quill/dist/quill.js",
                Quill: "quill/dist/quill.js"
            })
        ]
    }
}
