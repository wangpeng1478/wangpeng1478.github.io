const request = require('request');
module.exports = (event)=>{
    return new Promise((resolve, reject) => {
        let option = {
            method: event.method || "GET", //POST
            url: event.url,
            json: true,
        };
        if (event.body) {
            option.headers = { "Content-type": "application/json;charset=UTF-8" };
            option.body = event.body
        }
        if (event.form) {
            option.headers = { "Content-type": "multipart/form-data;charset=UTF-8" };
            option.form = event.form
        }
        if (event.headers) {
            option.headers = headers;
        }
        request(option, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                console.log('------------------error----------------')
                console.log(response.statusCode)
                console.log(body)
                console.log('------------------error----------------')
            }
        });
    });
}