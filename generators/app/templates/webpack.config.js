/**
 * Created by chunyang.gao on 17/3/5.
 */
var path=require('path');
var webpack = require('webpack');
const CleanPlugin = require("clean-webpack-plugin");
var ROOT_PATH=path.resolve(__dirname);
const DEV_PATH = path.resolve(ROOT_PATH, 'dist');


var env=process.env.NODE_ENV;

module.exports = {
    entry:['./src/js/index'],
    output:{
        // path: './dist',
        path: DEV_PATH,
        filename:'[name]-build.js',
        publicPath:"http://127.0.0.1:8080/lib/"
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: /node_modules/,
            enforce: 'pre' //webpack2写法
        },{
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
            //loaders的处理顺序是从右到左的
            include: /src\/css/
        }, {
            test: /\.(png|jpg|gif|jpeg)$/, //处理css文件中的背景图片
            loader: 'url-loader?limit=1&name=./static/assets/[name].[hash:4].[ext]'
            //当图片大小小于这个限制的时候，自动启用base64编码图片。
        },  {
            //当我们需要读取json格式文件时，webpack2中将会内置 json-loader，自动支持json格式的读取。
            test: /\.json$/, //获取json数据的loader
            loader: 'json-loader'
        },{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [
                    ['es2015', {modules: false}]   //tree-shaking
                ],
                plugins: [
                    ["transform-runtime"]
                ]
            }
        }],

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),   //dev-server-hot-function
    ],
    //webpack2 新增功能。限制bundle文件大小
    // warning时不影响打包进程，出现error会立即终止打包进程
    performance: {
        hints: "warning",
        maxEntrypointSize: 400000, //bytes,
        maxAssetSize: 400000 //bytes
    },
    resolve: {
        //extensions webpack2第一个不是空字符串! 对应不需要后缀的情况.
        extensions: ['.js', '.json', '.sass', '.scss', '.less',  '.vue'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            'assets': path.resolve(__dirname, './src/assets'),
            'components': path.resolve(__dirname, './src/components')
        },
        // enforceExtension: false,
        // // 强制使用扩展名：如果值为 false，在解析一个文件时，也会尝试匹配无扩展名的文件。
    },
   
    externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter'
    },
    devServer: {
        contentBase:  path.join(__dirname, "view"), //本地服务器所加载的页面所在的目录
        historyApiFallback: true,
        hot: true,
        open: true,
        inline: true, //实时刷新
        port: 8080
    },
}

switch (env) {
    case 'production':
        module.exports.plugins = (module.exports.plugins || []).concat([
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
           
            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
            new CleanPlugin(path.resolve(__dirname,'dist')),

            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    // warnings: true,   // 当因为副作用等原因DCE失败时，会在命令行中给出警告
                    warnings: false,
                    drop_console: true
                },
                comments: false,
                // beautify: true, // 添加适当的空格和换行
                beautify: false,
                sourceMap: false,
                // mangle: false   // 禁用变量混淆
            })
        ]);
        break;
}