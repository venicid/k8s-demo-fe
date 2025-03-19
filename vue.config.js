module.exports = {
    publicPath: '/',
    devServer:{
        host: '0.0.0.0',
        port: 8080, // 启动端口号
        open: true,  // 启动后是否自动打开网页
        before:require("./mock/mock-server.js")
    }
}
