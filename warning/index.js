const Sky = require('./api/sky'); //发送微信消息
Sky({
    city:'江苏省'
}).then(text=>{
    console.log(text);
})