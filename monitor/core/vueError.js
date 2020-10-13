import { getTimestamp, getLocationHref, formatError } from "./util"

const vueError = {
  init(cb, Vue) {
    Vue.config.errorHandler = function(err, vm, info){
      const errorInfo = formatError(err)
      errorInfo.message= `${errorInfo.message}(${info})`,
      errorInfo.pageUrl = getLocationHref()
      errorInfo.sTime = getTimestamp()
      errorInfo.resourceUrl = errorInfo.resourceUrl || (vm.$options && vm.$options.__file)
      errorInfo.componentName = vm.$options.name || vm.$options._componentTag
      errorInfo.type = 'onVueError'
      if (vm.$options.__file) {
        errorInfo.file = vm.$options.__file
      }
      cb(errorInfo)
    }
  }
}

export default vueError