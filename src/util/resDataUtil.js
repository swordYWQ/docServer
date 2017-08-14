const success = (result) => {
    var data = {
        code: 200,
        result: result,
        msg: ''
    }
    return JSON.stringify(data);
}
const accessError = (result) => {
    var data = {
        code: 301,
        result: result,
        msg: ''
    }
    return JSON.stringify(data);
}
const error = (result, err) => {
    var data = {
        code: 101,
        result: result,
        msg: err
    }
    return JSON.stringify(data);
}

module.exports = {
    success: success,
    error: error,
    accessError: accessError
};