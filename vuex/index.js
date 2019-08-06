let Vue;
class ModuleCollection {
  constructor(options) {
    this.register([], options);
  }
  /**
   *
   * @param {Array} path 空数组
   * @param {Object} rawModule 传入的options
   */
  register(path, rawModule) {
    let newModule = {
      _raw: rawModule,
      _children: {},
      state: rawModule.state
    };
    if (path.length == 0) {
      this.root = newModule; // 根
    } else {
      this.root._children[path[path.length - 1]] = newModule;
    }
    if (rawModule.modules) {
      forEach(rawModule.modules, (childName, module) => {
        this.register(path.concat(childName), module);
      });
    }
  }
}

class Store {
  constructor(options) {
    let state = options.state;
    this.getters = {};
    this.mutations = {};
    this.actions = {};

    // state
    this._vm = new Vue({
      data: {
        state // 把state变成响应式的 
      }
    });

    // 整理模块间关系
    this.modules = new ModuleCollection(options);

    // getter
    if (options.getters) {
      let getters = options.getters;
      forEach(getters, (getterName, getterFn) => {
        Object.defineProperty(this.getters, getterName, {
          get() {
            return getterFn(state);
          }
        });
      });
    }

    // mutations
    let mutations = options.mutations;
    forEach(mutations, (mutationName, mutationFn) => {
      this.mutations[mutationName] = () => {
        console.log(state);

        mutationFn.call(this, state);
      };
    });

    // actions
    let actions = options.actions;
    forEach(actions, (actionName, actionFn) => {
      this.actions[actionName] = (payLoad) => {
        actionFn.call(this, payLoad);
      };
    });

    // 再异步调用的时候this指向永远是Store
    let { commit, dispatch } = this;
    this.commit = type => {
      commit.call(this, type);
    };
    this.dispatch = type => {
      dispatch.call(this, type);
    };
  }
  get state() {
    return this._vm.state;
  }
  commit(type) {
    this.mutations[type]();
  }
  dispatch(type, payLoad) {
    this.actions[type](payLoad);
  }
}

function forEach(obj, cb) {
  Object.keys(obj).forEach(item => cb(item, obj[item]));
}

let install = _Vue => {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      // 判断是否是跟组件
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store;
      } else {
        // 子组件挂载$store
        this.$store = this.$parent && this.$parent.$store;
      }
    }
  });
};

export default {
  Store,
  install
};
