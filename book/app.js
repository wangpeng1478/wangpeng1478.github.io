
const fs = require('fs');
global.fileJson=[];
const files = JSON.stringify(toJSON('file'));
fs.writeFile('./files.json',files,function(err){
    if (err) {
        return console.error(err);
    };
    console.log("success");
});

function toJSON(Address){
    const array = fs.readdirSync(Address);
    array.forEach((item, index) => {
        const path = `${Address}/${item}`;
        //检测给定的路径是否存在
        if(fs.existsSync(path)){
            const stats = fs.statSync(path);
            const isDirectory = stats.isDirectory();
            //是否为目录
            global.fileJson.push({
                name:item,
                Address,
                path,
                isDirectory
            });
            if(isDirectory){
                toJSON(path)
            }
        }
    });
    return global.fileJson
};
 
