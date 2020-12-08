import env from './env'

const DEV_URL = '/'
const PRO_URL = 'https://wx-ba457a-1254176432.ap-shanghai.app.tcloudbase.com/'

export default env === 'development' ? DEV_URL : PRO_URL
