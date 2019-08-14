const def = {
  mode: "hash",
  routers: []
}

class Router {
  constructor(arg = def) {
    this.mode = arg.mode
    this.routers = arg.routers
    this.content = document.getElementById("wrap")

    this.addHandle()
    this.render()
  }
  addHandle() {
    window.addEventListener("click", e => {
      let event =  e || window.event
      let _target = event.target
      if (_target.tagName.toLowerCase() === "a" && _target.getAttribute('href')) {
        event.preventDefault()
        this.jump(_target.getAttribute('href'))
      }
    })

    window.addEventListener("hashchange", () => {
      this.render(window.location.hash.slice(1))
    })
    if (this.mode === 'history') {
      //浏览器的自动跳转和前进后退会触发popstate
      window.addEventListener('popstate', e => {
        const path = e.state.path || window.location.pathname || "/"
        this.render(path)
      })
    }
  }
  // 跳转
  jump(path) {
    if (this.mode === 'hash') {
      window.location.hash = path
    } else {
      window.history.pushState({path}, null, path)
      this.render(path)
    }
  }
  // 渲染
  render(path = "/") {
    const _page = this.routers.find(item => {
      return item.path === path
    })

    if (_page) {
      this.content.innerHTML = _page.component
    } else {  // 没有匹配到;则重定向
      const _all = this.routers.find(item => {
        return item.path === "*"
      })
      this.jump(_all.redirect)
    }
    
  }
}

// 调用
new Router({
  mode: "history",
  routers: [
    {
      path: '/page1',
      component: "<h1>页面1</h1>"
    }, {
      path: '/page2',
      component: "<h1>页面2</h1>"
    }, {
      path: '/page3',
      component: "<h1>页面3</h1>"
    }, {
      path: '/page4',
      component: "<h1>页面4</h1>"
    }, {
      path: '*',
      redirect: '/page1'
    }
  ]
})