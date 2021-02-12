const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const moment = require('moment');

const upload = async (ctx, next) => {
    const file = ctx.request.files.file;
    const hash = hash = CryptoJS.MD5(`${file.path}_${moment()}`);
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, '../../public/imgs' + `/${hash}.${file.name.split('.').pop()}`);
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    ctx.body = {
        status: 201,
        fileName: `${hash}.${file.name.splite('.').pop()}`
    };
}

module.exports = {
    'POST /imgs/upload': upload,
}