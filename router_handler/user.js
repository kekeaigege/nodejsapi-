const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')
//注册新用户的处理函数
exports.regUser = (req, res) => {
    const userinfo = req.body;
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, result) => {
        //执行sql语句
        if (err) {
            return res.cc(err)
        }
        if (result.length > 0) {
            return res.cc("用户名被占用")
        }
        //密码加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        const sql = 'insert into ev_users set ?'
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, result) => {
            if (err) {
                return res.cc(err.message)
            }
            if (result.affectedRows != 1)
                return res.cc("注册用户失败,请稍后再试")
            if (result.affectedRows == 1)
                return res.cc("注册用户成功", 0)
        })
    })
}
exports.userLogin = (req, res) => {
    const userinfo = req.body;
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, (err, result) => {
        //执行sql语句
        if (err) {
            return res.cc(err)
        }
        if (result.length != 1) {
            return res.cc("登录失败")
        }
        const compareResult = bcrypt.compareSync(userinfo.password,result[0].password);
        if(!compareResult) return res.cc("用户名或者密码错误")

        const user = {...result[0],password:'',user_pic:''}
        const tokenStr = jwt.sign(user,config.secrtKey,{expiresIn:'10h'})

        res.send({
            status: '0', 
            message:"登录成功", 
            token:'Bearer '+ tokenStr
        })
    })
}