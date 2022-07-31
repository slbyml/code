import { handleRouter } from "./handle-router"

let preRoute = ''
let nextRoute = window.location.pathname

export const getPreRoute = () => preRoute
export const getNextRoute = () => nextRoute
/**
 * 重写路由，便于监听
 */
export const rewriteRouter = () => {
  window.addEventListener('popstate', () => {
    preRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  })

  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    preRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    nextRoute = window.location.pathname
    handleRouter()
  }

  const rawReplaceState = window.history.replaceState
  window.history.replaceState = (...args) => {
    preRoute = window.location.pathname
    rawReplaceState.apply(window.history, args)
    nextRoute = window.location.pathname
    handleRouter()
  }
}
