const fs = require('fs')
const path = require('path')

const targetFilePath = './nnu_sn_login.bat'
fs.writeFileSync(targetFilePath, `node ${path.join(__dirname, 'app.js')}`)

console.log(`生成${targetFilePath}成功`)
