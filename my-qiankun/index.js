import { handleRouter } from "./handle-router"
import { rewriteRouter } from "./rewrite-router"

let _apps  = []

export const getApps = () => _apps

export const registerMicroApps = (apps) => {
  _apps = apps
}

/**
 *1、监视路由变化
 *2、匹配子应用
 *3、加载子应用
 *4、渲染子应用
 */
export const  start = () =>  {
  rewriteRouter()
  handleRouter()
}
