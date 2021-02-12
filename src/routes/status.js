const model = require('../models');
const {
    sta: Status
} = model;
const utils = require('../lib/utils');
const _ = require('lodash');

const updateStatus = async (ctx, next) => {
    const {
        statusId,
        colName,
        opreation,
        value
    } = ctx.request.body;
    try {
        const changeOne = await Status.findOne({
            where: {
                id: statusId
            }
        });
        if ((colName === 'voteUp' || colName === 'voteDown') && opreation === 'add') {
            if (colName === 'voteUp') {
                changeOne.voteUp = JSON.stringify([...JSON.parse(changeOne.voteUp), value]);
                changeOne.voteDown = JSON.stringify(_.pull(JSON.parse(changeOne.voteDown), value));
            } else {
                changeOne.voteDown = JSON.stringify([...JSON.parse(changeOne.voteDown), value]);
                changeOne.voteUp = JSON.stringify(_.pull(JSON.parse(changeOne.voteUp), value));
            }
        } else {
            changeOne[colName] = opreation === 'pull' ? JSON.stringify(_.pull(JSON.parse(changeOne[colName]), value)) :
                JSON.stringify([...JSON.parse(changeOne[colName]), value]);
        }
        changeOne.save();
        ctx.response.body = {
            status: 201,
            content: changeOne
        }
    } catch (err) {
        utils.catchError(ctx, err);
    }
}

module.exports = {
    'PUT /status': updateStatus
}