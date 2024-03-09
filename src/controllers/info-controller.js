const { StatusCodes } = require("http-status-codes");

async function info(req, res) {
    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'API IS LIVE',
        data: {},
        error: {}
    });
}

module.exports = info;