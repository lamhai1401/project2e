const handler = (req, res, next) => {
    res.responseError = (code , error) => {
        const err = {
            statusCode: 400,
            success: false,
            error: error,
            code: code
        };
        res.status(400).json(err);
    };
    res.responseFailAuth = (statuscode, code, error) => {
        const err = {
            statusCode: statusCode,
            success: false,
            error: error,
            code: code
        };
        res.status(statusCode).json(err);
    };
    res.responseSuccess = (data) => res.status(200).json(data);
    next();
};

module.exports = handler;