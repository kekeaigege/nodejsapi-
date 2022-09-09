const express = require('express');
const routes = express.Router();
const dealBack = require('../router_handler/user')
const {reg_login_schema} = require('../schema/user')
const expressJoi  = require('@escook/express-joi')
//注册新用户
routes.post('/reguser',expressJoi(reg_login_schema),dealBack.regUser
)
routes.post('/login',dealBack.userLogin)

module.exports = routes;