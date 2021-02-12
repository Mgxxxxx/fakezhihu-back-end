const utils = require('../lib/utils')
const model = require('../models');
const {
    users: User
} = model;

const {
    userAttributes
} = require("../config/deafult");

const list = async (ctx, next) => {
    try {
        const list = await User.findAll();
        ctx.response.status = 200;
        ctx.response.body = list;
    } catch (error) {
        utils.catchError(ctx, error);
    }
}

const createUser = async (ctx, next) => {
    const {
        name,
        pwd,
        email
    } = ctx.request.body;
    console.log(ctx.request.body);
    try {
        const infoList = await User.findAll({
            attributes: ['name', 'email']
        });
        const nameList = infoList.map(item => item.dataValues.name);
        if (nameList.includes(name)) {
            ctx.response.status = 203;
            ctx.response.body = {
                msg: '用户名重复，请更换用户名'
            };
            return;
        }
        const uniquedEmailList = infoList.map(item => item.dataValues.email);
        if (uniquedEmailList.includes(email)) {
            ctx.response.status = 203;
            ctx.response.body = {
                msg: '邮箱已存在，请更换邮箱或者直接登录'
            };
            return;
        }
        await User.create({
            name,
            pwd,
            email
        }).then(res => {
            ctx.response.status = 201;
            ctx.response.body = res;
        })
    } catch (error) {
        utils.catchError(ctx, error);
    }
}

let loginUser = async (ctx, next) => {
    const {
        name,
        pwd
    } = ctx.request.body;
    const where = {
        name,
        pwd
    };
    const attributes = ['id', ...userAttributes];
    try {
        await User.findOne({
            where,
            attributes
        }).then(res => {
            if (res === null) {
                ctx.response.status = 206;
                ctx.response.body = {
                    msg: '用户名或者密码不对，请修改后重新登录'
                }
                return;
            } else {
                utils.setCookies(ctx, res.dataValues);
                ctx.response.status = 200;
                ctx.response.body = res;
            }
        })
    } catch (error) {
        utils.catchError(ctx, err);
    }
}

const checkLogin = async (ctx, next) => {
    try {
        if (ctx.cookies.get('id')) {
            ctx.response.status = 200;
            ctx.response.body = {
                name: decodeURIComponent(ctx.cookies.get('name'))
            }
        } else {
            ctx.response.status = 202;
        }
    } catch (error) {
        utils.catchError(ctx, err);
    }
}

const logout = async (ctx, next) => {
    const cookies = {
        id: ctx.cookies.get('id'),
        name: ctx.cookies.get('name'),
        email: ctx.cookies.get('email')
    }
    try {
        utils.destoryCookies(ctx, cookies);
        ctx.response.status = 200;
    } catch (err) {
        catchError(err);
    }
}

const getUser = async (ctx, next) => {
    const id = ctx.query.id;
    const where = {
        id
    };
    try {
        await User.findOne({
            where,
            attributes: userAttributes
        }).then(res => {
            // console.log(res);
            ctx.response.body = {
                status: 200,
                content: res
            }
        })
    } catch (error) {
        utils.catchError(error);
    }
}

const updateUserInfo = async (ctx, next) => {
    const {
        id,
        colName,
        value
    } = ctx.request.body;
    try {
        await User.update({
            [colName]: value
        }, {
            where: {
                id
            }
        }).then(res => {
            ctx.response.body = {
                status: 201,
                content: res
            }
        })
    } catch (err) {
        utils.catchError(ctx, err)
    }
}

module.exports = {
    'GET /users': getUser,
    'GET /users/list': list,
    'POST /users/create': createUser,
    'POST /users/login': loginUser,
    'GET /users/checkLogin': checkLogin,
    'POST /users/logout': logout,
    'PUT /users/updateUserInfo': updateUserInfo
}