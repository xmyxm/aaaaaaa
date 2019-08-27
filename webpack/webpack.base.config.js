// webpackruntime.js
// 执行命令 webpack --config ./webpackdemo/webpackruntime.config.js

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackSpritesmithPlugin = require('webpack-spritesmith');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//webpack插件，用于清除目录文件
const packageFilePath = path.join(__dirname, '../dist');

const templateHeaderFunction = function (data) {
    // 这里比较特殊，合并的图都是实际显示的8倍，所以需要处理调整 background-size，建议使用2倍图，图片太大资源浪费
    let multiple = 8;

    let shared = '.icon-header {\n  background-image: url(I);\n  background-size: Wpx Hpx;\n}'.replace('I', data.sprites[0].image).replace('W', data.spritesheet.width / multiple)
        .replace('H', data.spritesheet.height / multiple)

    let perSprite = data.sprites.map(function (sprite) {
        return '.icon-N {\n  background-position: Xpx Ypx;\n}'
            .replace('N', sprite.name)
            .replace('X', sprite.offset_x / multiple)
            .replace('Y', sprite.offset_y / multiple);
    }).join('\n');
    return shared + '\n' + perSprite;
}

const templateIconsFunction = function (data) {
    // 这里比较特殊，合并的图都是实际显示的5倍，所以需要处理调整 background-size，建议使用2倍图，图片太大资源浪费
    let multiple = 5;

    let shared = '.icon {\n  background-image: url(I);\n  background-size: Wpx Hpx;\n}'.replace('I', data.sprites[0].image).replace('W', data.spritesheet.width / multiple)
        .replace('H', data.spritesheet.height / multiple)

    let perSprite = data.sprites.map(function (sprite) {
        return '.icon-N {\n  background-position: Xpx Ypx;\n}'
            .replace('N', sprite.name)
            .replace('X', sprite.offset_x / multiple)
            .replace('Y', sprite.offset_y / multiple);
    }).join('\n');
    return shared + '\n' + perSprite;
}

module.exports = {
    entry: {
        index: ['./src/page/index.js']
    },
    output: {
        path: packageFilePath,
        filename: 'js/[name].js'
    },
    cache: true,
    devtool: "source-map",
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        },
        runtimeChunk: {
            // manifest文件用来引导所有模块的交互。manifest文件包含了加载和处理模块的逻辑。
            // 当webpack编译器处理和映射应用代码时，它把模块的详细的信息都记录到了manifest文件中。当模块被打包并运输到浏览器上时，
            name: 'manifest'
        }
    },
    module: {
        rules: [{
            test: /\.(es6|jsx|js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    babelrc: true,// 配置使用 .babelrc 文件
                    cacheDirectory: true // 指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存
                }
            }
        },
        {
            test: /\.woff|ttf|woff2|eot$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 1000
                    }
                }
            ]
        }]
    },
    plugins: [
        new webpack.BannerPlugin('点评平台研发中心-图片雪碧图方案测试'),
        new CleanWebpackPlugin(),// 默认删除webpack output.path目录中的所有文件
        new HtmlWebpackPlugin({
            template: './src/html/index.html'
            , filename: 'index.html'//可以使用hash命名
            , title: 'index'
            , inject: 'body'//脚本包含到body 也可以写到head里面
            , chunks: ['manifest', 'commons', 'index']//指定当前模板需要打入哪些js模块
            , minify: {//启用代码代码压缩
                removeComments: false,//移除注释
                collapseWhitespace: false//移除空格
            }
        }),
        // 雪碧图插件(合并公共icon)
        new WebpackSpritesmithPlugin({
            // 目标小图标
            src: {
                // 合成雪碧图的icon图路径
                cwd: path.join(__dirname, '../src/image/icons'),
                // 匹配小图标文件后缀名，可以是一个正则
                glob: '*.png'
            },
            target: {
                // 生成雪碧图(大图)文件存放路径
                image: path.resolve(__dirname, '../src/sprites/icons.png'),
                // 生成对应的样式文件存放路径
                css: [
                    // 可以根据不同的 format 输出多组 css
                    [
                        path.resolve(__dirname, '../src/sprites/icons.css'),
                        { format: "templateIconsFunction" }
                    ]
                ]
            },
            // 导出的sprites.css样式文件中, 依赖的sprite.png的相对路径
            apiOptions: {
                cssImageRef: './icons.png'
            },
            // 雪碧图生成算法
            spritesmithOptions: {
                algorithm: 'binary-tree', // 默认使用二叉树最优排列算法 // top-down
                padding: 4// 每个小图标之间的间隙
            }
            , customTemplates: {
                'templateIconsFunction': templateIconsFunction
            }
        }),
        // 雪碧图插件(合并header)
        new WebpackSpritesmithPlugin({
            // 目标小图标
            src: {
                // 合成雪碧图的icon图路径
                cwd: path.join(__dirname, '../src/image/header'),
                // 匹配小图标文件后缀名，可以是一个正则
                glob: '*.png'
            },
            target: {
                // 生成雪碧图(大图)文件存放路径
                image: path.resolve(__dirname, '../src/sprites/header.png'),
                // 生成对应的样式文件存放路径
                css: [
                    // 可以根据不同的 format 输出多组 css
                    [
                        path.resolve(__dirname, '../src/sprites/header.css'),
                        { format: "templateHeaderFunction" }
                    ]
                ]
            },
            // 导出的sprites.css样式文件中, 依赖的sprite.png的相对路径
            apiOptions: {
                cssImageRef: './header.png'
            },
            // 雪碧图生成算法
            spritesmithOptions: {
                algorithm: 'binary-tree', // 默认使用二叉树最优排列算法 // top-down
                padding: 4// 每个小图标之间的间隙
            }
            , customTemplates: {
                'templateHeaderFunction': templateHeaderFunction
            }
        })
    ]
}
