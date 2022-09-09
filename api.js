const express = require('express');
const cors = require('cors')
const app = express();
const router = require('./router/user');
const joi = require("joi")
const expressJWT = require('express-jwt')
const config = require('./config')
//解决跨域
app.use(cors());
//解析表单数据的中间件只能解析xxx3www
app.use(express.urlencoded({
    extended: false
}));
app.use(expressJWT({
    secret: config.secrtKey,
    algorithms: ["HS256"]
}).unless({
    path: [/^\/api\//] //定义那些接口不需要进行token认证
}));
app.use((req, res, next) => {
    //status 默认是1代表失败
    //err的值可能是一个错误对象 可能是一个错误的描述字符串
    //中间件的形式用res挂载了这个函数
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next();
})
//再路由之前配置解析Token的中间件

app.use('/api', router)
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc("无效token");
    //未知的错误
    res.cc(err)
})
app.listen(8089, () => {
    console.log('http://localhost:8089');
})