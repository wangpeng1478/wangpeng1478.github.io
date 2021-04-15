const httprequest = require('./httprequest'); //请求
module.exports = async(event) => {
    var str = "";
    const getAlarmList = await httprequest({
        method: "GET",
        url: `http://product.weather.com.cn/alarm/grepalarm_cn.php?_=${new Date().getTime()}`
    });
    if (getAlarmList) {
        try {
            var ids = [];
            var array = JSON.parse(getAlarmList.replace(/var alarminfo={"count":"\d+","data":/, '').replace(/};/, ''));
            array.forEach(element => {
                if (element[0].indexOf(event.city) != -1) {
                    ids.push(element[1])
                }
            });
            var getAllAlarmInfo = async(Arr, city) => {
                var AllAlarmInfo = Arr.map(async(e, i) => {
                    return new Promise(async res => {
                        const getAlarmInfo = await httprequest({
                            method: "GET",
                            url: `http://product.weather.com.cn/alarm/webdata/${e}?_=${new Date().getTime()}`
                        });
                        if (getAlarmInfo) {
                            try {
                                var info = JSON.parse(getAlarmInfo.replace(/var alarminfo=/, '').replace(/};/, ''));
                                if (info.head.indexOf(city) != -1) {
                                    var id = e.split('-')[2];
                                    var Minfo = await httprequest({
                                        method: "GET",
                                        url: `http://www.weather.com.cn/data/alarminfo/${id}?_=${new Date().getTime()}`
                                    });
                                    info.info = JSON.parse(Minfo.replace(/var alarmfyzn=/, ''));
                                    var ISSUECONTENT = info.ISSUECONTENT.replace(/（预警信息来源：国家预警信息发布中心）/, '');
                                    var bz = info.info[2].replace(/<br>/, '');
                                    // var zn = info.info[3].replace(/<br>/, '');
                                    res(`${ISSUECONTENT}。${bz}`)
                                } else {
                                    res('')
                                }
                                
                            } catch (error) {
                                console.log(error)
                            }

                        }
                    })
                })
                return Promise.all(AllAlarmInfo)
            }
            var AllAlarmInfoArray = await getAllAlarmInfo(ids, event.city);
            AllAlarmInfoArray.forEach(element => {
                if (element) {
                    str += element+'\n\n';
                }
            });
        } catch (error) {
            console.log(error)
        }
    };
    return str
}