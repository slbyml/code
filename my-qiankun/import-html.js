import { fetchResource } from "./fetch-resource"

export const importHTML = async (url) => {
  // 将子应用entry内容转成dom，方便操作标签
  const html = await fetchResource(url)
  const template  = document.createElement('div')
  template.innerHTML = html

  const scripts = template.querySelectorAll('script')

  // 获取所有script标签内的代码:<string[]>
  const getExternalScripts = () =>  {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src')
      if (!src) { // 行内脚本
        return Promise.resolve(script.innerHTML)
      } else { // 外链脚本
        return fetchResource(src.startsWith('http') ? src : `${url}${src}`)
      }
    }))
  }

  // 获取并执行所有script代码
  const execScripts = async () => {
    const scripts = await getExternalScripts()

    // 手动制造commonjs环境，供打包成utm格式的子应用使用
    const module = {exports: {}}
    const exports = module.exports

    scripts.forEach(code => {
      eval(code)
    })

    return module.exports
  }
  return {
    template,
    getExternalScripts,
    execScripts
  }
}
