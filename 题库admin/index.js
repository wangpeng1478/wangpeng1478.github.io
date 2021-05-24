const express = require("express");
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use('/public', express.static('public'));

const urlencodedParser = bodyParser.urlencoded({ extended: false })
    //解决跨域
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

//encodeURIComponent 编码
//decodeURIComponent 解码

const topicName = `2020-社区管理与服务.json`;
// const topicName = `2020-移动互联网技术.json`;
// const topicName = `2021-移动互联网技术.json`;

// list
app.get("/getList", async(req, res) => {
        try {
            res.json({
                code: 'ok',
                result: await pagination()
            })
        } catch (err) {
            res.json({
                code: '-1',
                msg: '请求失败'
            })
        }
    })
    // list
app.post("/find", urlencodedParser, async(req, res) => {
    try {
        try {
            var query = req.body.query;
            if (query) {
                res.json(await FindTopic(dealStr(decodeURIComponent(repairPerReplace(query)))))
            } else {
                res.json({
                    code: '-1',
                    msg: '参数错误'
                })
            }
        } catch (error) {
            res.json({
                code: '-1',
                msg: '请求失败'
            })
        }

    } catch (err) {
        res.json([])
    }
})

// add
app.post("/add", urlencodedParser, async(req, res) => {
    try {
        const response = {
            "n": encodeURIComponent(dealStr(repairPerReplace(req.body.n))),
            "t": encodeURIComponent(dealStr(repairPerReplace(req.body.t))),
            "a": encodeURIComponent(dealStr(repairPerReplace(req.body.a)))
        };
        if (!response.n || !response.a || response.n == "undefined" || response.a == "undefined") {
            res.json({
                code: '-1',
                codeIndex:0,
                msg: '新增失败'
            })
        }
        if (req.body.i) {
            const index = req.body.i;
            await updateJson(index, response).then(type => {
                if (type === "ok") {
                    res.json({
                        code: 'ok',
                        is:1,
                        result: response
                    })
                } else {
                    res.json({
                        code: '-1',
                        codeIndex:1,
                        msg: '新增失败'
                    })
                }
            })
        } else {
            var isRe = await isRepeat(dealStr(decodeURIComponent(repairPerReplace(req.body.n))));
            if (isRe === "ok") {
                await writeJson(response).then(type => {
                    if (type === "ok") {
                        res.json({
                            code: 'ok',
                            is:2,
                            result: response
                        })
                    } else {
                        res.json({
                            code: '-1',
                            codeIndex:2,
                            msg: '新增失败'
                        })
                    }
                })
            } else {
                res.json({
                    code: '-1',
                    codeIndex:3,
                    msg: `【${dealStr(repairPerReplace(req.body.n))}】已存在`
                })
            }
        }


    } catch (err) {
        console.log(err);
        res.json({
            code: '-1',
            codeIndex:4,
            msg: '新增失败'
        })
    }
})

// delete
app.post("/delete", urlencodedParser, async(req, res) => {
    try {
        const { n } = req.body;
        if (n) {
            await deleteJson(decodeURIComponent(repairPerReplace(n))).then(type => {
                if (type === "ok") {
                    res.json({
                        code: 'ok',
                        result: n
                    })
                } else {
                    res.json({
                        code: '-1',
                        msg: '新增失败'
                    })
                }
            })
        } else {
            res.json({
                code: '-1',
                msg: '参数错误'
            })
        }

    } catch (err) {
        res.json({
            code: '-1',
            msg: '请求失败'
        })
    }
})

// 修改文件名
app.post("/modifyFileName", urlencodedParser, async(req, res) => {
    try {
        const { path } = req.body;
        if (path) {
            if(modifyFileName(path)){
                res.json({
                    code: 'ok',
                    result: path
                })
            }else{
                res.json({
                    code: '-1',
                    msg: '修改失败'
                })  
            }
        } else {
            res.json({
                code: '-1',
                msg: '参数错误'
            })
        }

    } catch (err) {
        res.json({
            code: '-1',
            msg: '请求失败'
        })
    }
})

// findFiles
app.post("/findFiles", urlencodedParser, async(req, res) => {
    try {
        const { title } = req.body;
        if (title) {
            try {
                const path = `answer/${decodeURIComponent(title)}.txt`;
                const stats = fs.statSync(path);
                if (stats.isFile()) {
                    const data = fs.readFileSync(path);
                    res.json({
                        code: 'ok',
                        result: data.toString()
                    });
                } else {
                    res.json({
                        code: '-1',
                        msg: `[${decodeURIComponent(title)}]不存在`
                    })
                }
            } catch (error) {
                res.json({
                    code: '-1',
                    msg: '打开文件失败_' + error
                })
            }

        } else {
            res.json({
                code: '-1',
                msg: '参数错误'
            })
        }
    } catch (err) {
        res.json({
            code: '-1',
            msg: '请求失败'
        })
    }
})

//增加
function writeJson(params) {
    return new Promise((resolve, reject) => {
        fs.readFile(topicName, function(err, data) {
            if (err) {
                resolve('-1')
            }
            var person = data.toString();
            person = JSON.parse(person);
            person.data.unshift(params);
            person.total = person.data.length;
            var str = JSON.stringify(person);
            fs.writeFile(topicName, str, function(err) {
                if (err) {
                    resolve('-1')
                }
                resolve('ok')
            })
        })
    });
};
//查
function pagination() {
    return new Promise((resolve, reject) => {
        fs.readFile(topicName, function(err, data) {
            if (err) {
                resolve('-1')
            }
            var person = data.toString();
            person = JSON.parse(person);
            resolve(person.data)
        })
    });
}
//删
function deleteJson(n) {
    return new Promise((resolve, reject) => {
        fs.readFile(topicName, function(err, data) {
            if (err) {
                resolve(err)
            }
            var person = data.toString();
            person = JSON.parse(person);
            for (var i = 0; i < person.data.length; i++) {
                if (dealStr(decodeURIComponent(n || '')) == dealStr(decodeURIComponent(person.data[i].n || ''))) {
                    person.data.splice(i, 1);
                }
            }
            person.total = person.data.length;
            var str = JSON.stringify(person);
            fs.writeFile(topicName, str, function(err) {
                if (err) {
                    resolve(err)
                }
                resolve('ok')
            })
        })
    });
}
//update
function updateJson(index, obj) {
    return new Promise((resolve, reject) => {
        fs.readFile(topicName, function(err, data) {
            if (err) {
                resolve(err)
            }
            var person = data.toString();
            person = JSON.parse(person);
            person.data[index] = obj;
            person.total = person.data.length;
            var str = JSON.stringify(person);
            fs.writeFile(topicName, str, function(err) {
                if (err) {
                    resolve(err)
                }
                resolve('ok')
            })
        })
    });
}
//判断重复

function isRepeat(n) {
    return new Promise((resolve, reject) => {
        fs.readFile(topicName, function(err, data) {
            if (err) {
                resolve(err)
            }
            var person = data.toString();
            person = JSON.parse(person);
            var is = true;
            for (var i = 0; i < person.data.length; i++) {
                if (dealStr(decodeURIComponent(n || '')) == dealStr(decodeURIComponent(person.data[i].n || ''))) {
                    is = false;
                    break;
                }
            };
            if (is) {
                resolve("ok")
            } else {
                resolve(n)
            }
        })
    });
}



//查找
function FindTopic(n) {
    return new Promise((resolve, reject) => {
        fs.readFile(topicName, function(err, data) {
            if (err) {
                resolve(err)
            }
            var person = data.toString();
            person = JSON.parse(person);
            var info = null;
            for (var i = 0; i < person.data.length; i++) {
                if (dealStr(decodeURIComponent(n || '')) == dealStr(decodeURIComponent(person.data[i].n || ''))) {
                    info = person.data[i];
                    break;
                }
            };
            resolve(info)
        })
    });
}


//处理数据
function dealStr(str) {
    if (str) {
        str = str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""); //删除emoji
        str = str.replace(/^\s+|\s+$/g, ""); //去除两头空格
        str = str.replace(/(。$)/g, ""); //删除最后一个【。】
        str = str.replace(/^[A-Z]\./ig, ''); //删除开头A-Z+.
        str = str.replace(/^[0-9]+\./ig, ''); //删除开头0-9+.
        str = str.replace(/^\s+|\s+$/g, ""); //去除两头空格
        return str
    }
    return ""
};


//修复nodejs % [替换]
function repairPerReplace(str){
    if (str) {
        str = str.replace(/%/ig, '[0/0]'); //删除开头0-9+.
        return str
    };
    return ""
};
//修复nodejs % [还原]
function repairPerRestore(str){
    if (str) {
        str = str.replace(/\[0\/0\]/ig, '%'); //删除开头0-9+.
        return str
    };
    return ""
};


//修改文件名称

function modifyFileName(pathStr){
    if(pathStr){
        const pathArr = decodeURIComponent(pathStr).split('-');
        if(pathArr.length===2){
            try {
                const pathList =  fs.readdirSync(`电子商务实践`);
                let isRename = false;
                pathList.forEach(filename => {
                    // 确定新旧文件名称
                    const oldPath = `电子商务实践/${filename}`;
                    const newPath = `电子商务实践/${decodeURIComponent(pathStr)}.docx`;
                    fs.renameSync(oldPath, newPath);
                    isRename = true;
                    // console.log(`修改成功-[${newPath}]`);
                });
                return isRename
            } catch (error) {
                console.log(error);
                return false
            }
            
        }else{
            console.log(-1);
            return false
        }
        
    }else{
        console.log(-2);
        return false
    }
    
};

app.listen(9999, () => {
    console.log("http://localhost:9999");
})




