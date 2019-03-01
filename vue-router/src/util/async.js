/* @flow */

/**
 * 
 * @param {Array} queue 遍历的任务队列
 * @param {Function} fn 每一项需要调用的函数
 * @param {Function} cb 遍历完毕后的回调
 */
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
