import { getApps } from "."
import { importHTML } from "./import-html";
import { getNextRoute, getPreRoute } from "./rewrite-router";

// 处理路由变化
export const handleRouter = async () => {
  const apps = getApps()

  // 获取上一个应用
  const preApp = apps.find(item => {
    return getPreRoute().startsWith(item.activeRule)
  })
  // 如果有上一个应用则先卸载上一个应用
  if (preApp) {
    await unmount(preApp)
  }

  // 获取下一个应用
  const app = apps.find(item => {
    return getNextRoute().startsWith(item.activeRule)
  })
  if (!app) return;
  const container = document.querySelector(app.container)
  // 加载子应用
  const { template,  execScripts } = await importHTML(app.entry)
  container.appendChild(template)

  // 配置全局变量，
  // 代表在主应用内渲染
  window.__POWERED_BY_QIANKUN__ = true
  // 代表子应用的publicPath
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + '/'

  const appExports = await execScripts()

  app.boostrap = appExports.boostrap
  app.mount = appExports.mount
  app.unmount = appExports.unmount

  await boostrap(app)
  await mount(app)
  await unmount(app)

}

async function boostrap(app) {
  app.boostrap && await app.boostrap()
}
async function mount(app) {
  app.mount && await app.mount({
    container: document.querySelector(app.container)
  })
}
async function unmount(app) {
  app.unmount && await app.unmount({
    container: document.querySelector(app.container)
  })
}
