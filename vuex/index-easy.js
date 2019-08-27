let Vue
class Store {
  constructor (options) {
    const state = options.state
    this.getters = {}
    this.mutations = {}
    this.actions = {}

    // state
    this._vm = new Vue({
      data: {
        state
      }
    })

    // getter
    if (options.getters) {
      const getters = options.getters
      forEach(getters, (getterName, getterFn) => {
        Object.defineProperty(this.getters, getterName, {
          get () {
            return getterFn(state)
          }
        })
      })
    }

    // mutations
    const mutations = options.mutations
    forEach(mutations, (mutationName, mutationFn) => {
      this.mutations[mutationName] = () => {
        console.log(state)

        mutationFn.call(this, state)
      }
    })

    // actions
    const actions = options.actions
    forEach(actions, (actionName, actionFn) => {
      this.actions[actionName] = () => {
        actionFn.call(this, this)
      }
    })

    // 再异步调用的时候this指向永远是Store
    const { commit, dispatch } = this
    this.commit = type => {
      commit.call(this, type)
    }
    this.dispatch = type => {
      dispatch.call(this, type)
    }
  }

  get state () {
    return this._vm.state
  }

  commit (type) {
    this.mutations[type]()
  }

  dispatch (type) {
    this.actions[type]()
  }
}

function forEach (obj, cb) {
  Object.keys(obj).forEach(item => cb(item, obj[item]))
}

const install = _Vue => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      // 判断是否是跟组件
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        // 子组件挂载$store
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  Store,
  install
}
