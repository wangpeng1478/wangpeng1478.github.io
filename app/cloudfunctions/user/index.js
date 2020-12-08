// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID;
  if(event.type==='get'){
    const userInfo = await db.collection('user').where({openid:OPENID}).get();
    if(userInfo.errMsg==="collection.get:ok"){
      if(userInfo.data.length===0){
        await db.collection('user').add({
          data:{
            openid:OPENID,
            registeredTime:Date.now() - (4 * 60 * 60 * 1000),
            lastLoginTime:Date.now() - (4 * 60 * 60 * 1000)
          }
        })
      }else{
        await db.collection('user').where({openid:OPENID}).update({
          data:{
            lastLoginTime:Date.now() - (4 * 60 * 60 * 1000)
          }
        })
      }
    }
  };
  return {
    type:event.type,
    openid: OPENID
  }
}