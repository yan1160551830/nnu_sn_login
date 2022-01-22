const axios = require('axios')
const fs = require("fs")

let config = {}
try {
  config = fs.readFileSync(__dirname + '/config.json', 'utf-8')
  config = JSON.parse(config)
} catch (e) {
  console.log('请检查配置文件!\n', e.message)

  process.exit(-1)
} finally {
  if (!config.username || !config.password) {
    console.log('请检查配置文件是否填写完整')
    process.exit(-1)
  }
}

async function login() {
  let result = null
  try {
    result = await axios.post(`http://192.168.16.20/portal_io/login?username=${config.username}&password=${config.password}`)
  } catch (e) {
    console.log('发送登录请求时出错', e.message)
    console.log('将会在1分钟后尝试重新登录')
    setTimeout(() => {
      login()
    }, 1000 * 60)

    return ;
  }

  const {reply_code, reply_msg} = result.data
  if (reply_code === 1 || reply_code === 6) {
    console.log(`登录成功; 响应代码: ${reply_code}; 响应信息: ${reply_msg}`)
  } else {
    console.log(`登录失败; 响应信息: ${reply_msg}`)
    console.log('将会在1分钟后尝试重新登录')
    setTimeout(() => {
      login()
    }, 1000 * 60)
  }
}

let firstLoginDelayTime = config.firstLoginDelayTime || 3
console.log(`将会在${firstLoginDelayTime}s后执行首次登录校园网操作`)
// 首次启动登录，延迟3s
setTimeout(() => {
  login()
}, 1000 * firstLoginDelayTime)
