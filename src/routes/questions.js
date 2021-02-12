const model = require('../models');
const {
    questions: Question,
    answers: Answer
} = model;
const utils = require('../lib/utils');
const {
    userAttributes,
    questionAttributes,
    answerAttributes
} = require('../config/deafult');

const questionInclude = [{
    model: model.users,
    attributes: userAttributes,
    as: 'author'
}];

const _getQuestion = async (ctx, next) => {
    const {
        questionId
    } = ctx.query;
    const where = {
        id: questionId
    };
    try {
        await Question.findOne({
            where,
            include: questionInclude,
            arrtibutes: questionAttributes
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

const getQuestion = async (ctx, next) => {
    const {
        questionId
    } = ctx.query;
    const questionWhere = {
        id: questionId
    };
    const answerWhere = {
        targetId: questionId
    };
    const answerInclude = [{
        model: model.sta,
        as: 'status',
        where: {
            targetType: 2
        },
    }, {
        model: model.users,
        attributes: userAttributes,
        as: 'author',
    }]
    try {
        // console.log('query question');
        const questionContent = await Question.findOne({
            where: questionWhere,
            attributes: questionAttributes
        });
        // console.log('query answer');
        const answerList = await Answer.findAndCountAll({
            where: answerWhere,
            include: answerInclude,
            attributes: answerAttributes
        })
        // console.log('end');
        const finlData = questionContent;
        finlData.dataValues.answer = answerList.rows.map(item => item.dataValues);
        // console.log(finlData.dataValues.answer);
        ctx.response.body = {
            status: 200,
            content: finlData
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const createQuestions = async (ctx, netx) => {
    console.log(ctx.request.body);
    const {
        discription,
        excerpt,
        title,
        userId
    } = ctx.request.body;
    try {
        await Question.create({
            discription,
            excerpt,
            title,
            creatorId: userId,
            type: 1
        }).then(res => {
            ctx.response.body = {
                status: 201,
                msg: '创建成功'
            }
        })
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

const updateQuestions = async (ctx, next) => {
    const {
        discription,
        questionId,
        // content,
        excerpt,
        title,
        userId
    } = ctx.request.body;
    const where = {
        id: questionId,
        creatorId: userId
    };
    try {
        const questionExist = await Question.findOne({
            where
        });
        if (!questionExist) {
            ctx.response.body = {
                status: 2001,
                msg: '问题不存在或无权限'
            }
        } else {
            await Question.update({
                discription,
                excerpt,
                title
            }, {
                where
            }).then(res => {
                ctx.response.body = {
                    status: 202,
                    msg: '问题修改成功'
                }
            })
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

module.exports = {
    'POST /questions': createQuestions,
    'PUT /questions': updateQuestions,
    'GET /questions': getQuestion
}