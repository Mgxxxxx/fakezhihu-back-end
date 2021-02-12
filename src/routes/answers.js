const model = require('../models');
const {
    answers: Answer,
    sta: Status
} = model;
const _ = require('lodash');
const utils = require('../lib/utils')
const {
    answerAttributes,
} = require('../config/deafult');

const createAnswer = async (ctx, next) => {
    const {
        creatorId,
        targetId,
        content,
        excerpt
    } = ctx.request.body;
    try {
        await Answer.create({
            creatorId,
            targetId,
            content,
            excerpt,
            type: 2
        }).then(res => {
            console.log(res.dataValues);
            return Status.create({
                voteUp: '[]',
                voteDowm: '[]',
                favorite: '[]',
                thanks: '[]',
                targetId: res.dataValues.id,
                targetType: 2
            }).then(res => {
                ctx.response.body = {
                    status: 201,
                    msg: '创建成功'
                }
            })
        })
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const deleteAnswers = async (ctx, next) => {
    const {
        answerId,
        userId
    } = ctx.request.body;
    const where = {
        id: answerId,
        creatorId: userId
    };
    try {
        const answerExist = Answer.findOne({
            where
        });
        if (answerExist) {
            await Answer.destory({
                where: {
                    targetId: answerId,
                    targetType: 2
                }
            }).then(res => {
                ctx.response.body = {
                    status: 202,
                    msg: '删除成功'
                }
            })
        } else {
            ctx.response.body = {
                status: 2001,
                msg: '答案不存在或无权限'
            }
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const updateAnswer = async (ctx, next) => {
    const {
        answerId,
        creatorId,
        content,
        excerpt
    } = ctx.request.body;
    const where = {
        creatorId,
        id: answerId
    };
    try {
        const answerExist = Answer.findOne({
            where
        });
        if (answerExist) {
            await Answer.update({
                content,
                excerpt
            }).then(res => {
                ctx.response.body = {
                    status: 201,
                    msg: '答案修改成功'
                }
            })
        } else {
            ctx.response.body = {
                status: 2001,
                msg: '答案不存在或无权限'
            }
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

module.exports = {
    'POST /answers': createAnswer,
    'DELETE /answers': deleteAnswers,
    'PUT /answers': updateAnswer
}