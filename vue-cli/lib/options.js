const path = require('path')
const metadata = require('read-metadata')
const exists = require('fs').existsSync
const getGitUser = require('./git-user')
const validateName = require('validate-npm-package-name')

/**
 * Read prompts metadata.
 *
 * @param {String} dir
 * @return {Object}
 */

module.exports = function options (name, dir) {
  const opts = getMetadata(dir)

  setDefault(opts, 'name', name) //设置生成项目默认名与文件夹保持一致
  setValidateName(opts) //判断设置的项目名是否有效

  const author = getGitUser()
  if (author) { //设置默认的name为git配置中的user.name
    setDefault(opts, 'author', author)
  }

  return opts
}

/**
 * Gets the metadata from either a meta.json or meta.js file.
 *
 * @param  {String} dir
 * @return {Object}
 */

function getMetadata (dir) {
  //支持js和json两种方式进行配置
  const json = path.join(dir, 'meta.json')
  const js = path.join(dir, 'meta.js')
  let opts = {}

  if (exists(json)) {
    opts = metadata.sync(json) //读取josn文件，转成一个对象
  } else if (exists(js)) {
    const req = require(path.resolve(js)) //加载js文件，获取配置
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }

  return opts
}

/**
 * Set the default value for a prompt question
 *
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */

function setDefault (opts, key, val) {
  if (opts.schema) { //进行字段的兼容处理
    opts.prompts = opts.schema
    delete opts.schema
  }
  const prompts = opts.prompts || (opts.prompts = {})
  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': val
    }
  } else {
    prompts[key]['default'] = val
  }
}

function setValidateName (opts) {
  const name = opts.prompts.name
  const customValidate = name.validate
  name.validate = name => {
    const its = validateName(name) //判断是否符合npm中name自动的标准
    if (!its.validForNewPackages) {
      const errors = (its.errors || []).concat(its.warnings || [])
      return 'Sorry, ' + errors.join(' and ') + '.'
    }
    //如果定义的校验规则，则调用
    if (typeof customValidate === 'function') return customValidate(name)
    return true
  }
}
