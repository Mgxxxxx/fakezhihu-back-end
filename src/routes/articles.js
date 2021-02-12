const model = require('../models');
const {
    articles: Article,
    sta: Status
} = model;

// const _ = require('lodash');
const utils = require('../lib/utils');
const {
    userAttributes,
    articleAttributes,
    commentAttributes
} = require('../config/deafult');

const articleInclude = [{
    model: model.users,
    attributes: userAttributes,
    as: 'author'
}, {
    model: model.sta,
    as: 'status',
    where: {
        targetType: 0
    }
}, {
    model: model.comments,
    attributes: commentAttributes,
    as: 'comment',
    required: false,
    where: {
        targetType: 0
    }
}];

const createArticls = async (ctx, next) => {
    const {
        content,
        excerpt,
        title,
        imgUrl,
        userId
    } = ctx.request.body;
    try {
        await Article.create({
            content,
            excerpt,
            title,
            cover: imgUrl,
            creator: userId,
            type: 0
        }).then(res => {
            return Status.create({
                voteUp: '[]',
                voteDown: '[]',
                favorite: '[]',
                thanks: '[]',
                targetId: res.dataValues.id,
                targetType: 0
            }).then(res => {
                ctx.response.body = {
                    status: 200,
                    msg: '创建成功'
                }
            })
        })
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const deleteArticles = async (ctx, next) => {
    const {
        articleId,
        userId
    } = ctx.request.body;
    const where = {
        id: articleId,
        creatorId: userId
    };
    try {
        const articleExist = await Article.findOne({
            where
        });
        if (articleExist) {
            await Article.destory({
                where
            }).then(res => {
                return Status.destory({
                    where: {
                        targetId: articleId,
                        targetType: 0
                    }
                }).then(res => {
                    ctx.response.body = {
                        status: 202,
                        msg: '删除成功'
                    }
                })
            })
        } else {
            ctx.response.body = {
                status: 2001,
                msg: '文章不存在或者无权限'
            }
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const getArticle = async (ctx, next) => {
    const {
        articleId
    } = ctx.query;
    const where = {
        id: articleId
    };
    try {
        await Article.findOne({
            where,
            include: articleInclude,
            arrtibutes: articleAttributes
        }).then(res => {
            ctx.response.body = {
                status: 200,
                content: res
            }
        })
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const getArticleList = async (ctx, next) => {
    try {
        const order = [
            ['id', 'DESC']
        ];
        const limit = 10;
        const articleList = await Article.findAll({
            order,
            limit,
            include: articleInclude,
            attributes: articleAttributes
        });
        ctx.response.body = {
            status: 200,
            list: articleList
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const updateArticle = async (ctx, next) => {
    const {
        articleId,
        content,
        excerpt,
        title,
        imgUrl,
        userId
    } = ctx.request.body;
    const where = {
        id: articleId,
        creatorId: userId
    }
    try {
        const articleExist = await Article.findOne({
            where
        });
        if (!articleExist) {
            ctx.response.body = {
                status: 2001,
                msg: '文章不存在或无权限'
            }
        } else {
            await Article.update({
                content,
                excerpt,
                title,
                cover: imgUrl
            }, {
                where
            }).then(res => {
                ctx.response.body = {
                    status: 201,
                    msg: '文章修改成功'
                }
            })
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

module.exports = {
    'POST /articles': createArticls,
    'DELETE /articles': deleteArticles,
    'GET /articles': getArticle,
    'GET /articles/list': getArticleList,
    'PUT /articles': updateArticle
}