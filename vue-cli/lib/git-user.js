const exec = require('child_process').execSync

module.exports = () => {
  let name
  let email
  // 获取git相关配置
  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')

  //字符串拼接，最后结果为 "username <email@xxx.com>"
  return (name || '') + (email || '')
}
