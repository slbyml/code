/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/compile.js":
/*!************************!*\
  !*** ./src/compile.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Complite; });\n/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watcher */ \"./src/watcher.js\");\n\r\n/**\r\n * 获取dom，并放在文档碎片中\r\n * 编译并解析文档碎片中模板文件，\r\n * 回填入真是dom中 \r\n * @param {*} el 需要绑定的 根dom\r\n * @param {*} vm MVVM实例\r\n */\r\nclass Complite{\r\n  constructor(el, vm) {\r\n    // 根节点挂在实例中，方便外部调用； eq:Vue.$el形式\r\n    vm.$el = this.isElementNode(el) ? el : document.querySelector(el)  \r\n    this.$vm = vm\r\n    if (vm.$el) {\r\n      this.$el = vm.$el\r\n      this.$fragment = document.createDocumentFragment()\r\n      let child;\r\n      // 依次将原生节点拷贝到文档碎片中\r\n      while (child = vm.$el.firstChild) {\r\n        this.$fragment.appendChild(child)\r\n      }\r\n      this.compileElement()\r\n      vm.$el.appendChild(this.$fragment)\r\n    }\r\n  }\r\n  // 判断是否是元素节点\r\n  isElementNode(node) {\r\n    return node.nodeType === 1\r\n  }\r\n  // 判断是否是文本节点\r\n  isTextNode(node) {\r\n    return node.nodeType === 3\r\n  }\r\n  // 编译模板\r\n  compileElement(el = this.$fragment) {\r\n    const reg=/\\{\\{(.*?)\\}\\}/g\r\n    Array.from(el.childNodes).forEach(node => {\r\n      const text= node.textContent\r\n      if (this.isTextNode(node) && reg.test(text)) {  // 文本节点\r\n        this.compileText(node, text, reg)\r\n      } else if (this.isElementNode(node)) {   // 元素节点\r\n\r\n      }\r\n      if (node.childNodes && node.childNodes.length) {\r\n        this.compileElement(node)\r\n      }\r\n    })\r\n  }\r\n  // 替换文本节点\r\n  compileText(node, text, reg) {\r\n    // 将匹配到的{{值}}转换成数组；eq: a.b.c -> [a,b,c]\r\n    let arr = RegExp.$1.split(\".\")\r\n    let val = this.$vm\r\n    // 获取到真正的key对应的value\r\n    arr.forEach(key => {\r\n      val = val[key]\r\n    })\r\n    new _watcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.$vm, RegExp.$1, (newVal) => {\r\n      node.textContent = text.replace(reg, newVal)\r\n    })\r\n    node.textContent = text.replace(reg, val)\r\n  }\r\n}\n\n//# sourceURL=webpack:///./src/compile.js?");

/***/ }),

/***/ "./src/dep.js":
/*!********************!*\
  !*** ./src/dep.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Dep; });\n/**\r\n * 发布订阅模式\r\n */\r\nclass Dep{\r\n  constructor() {\r\n    this.subs = []\r\n  }\r\n  // 订阅\r\n  addSub(sub) {\r\n    this.subs.push(sub)\r\n  }\r\n  // 通知所有订阅者更新\r\n  notify() {\r\n    this.subs.forEach(sub => {\r\n      sub.update()\r\n    })\r\n  }\r\n  // 删除订阅者\r\n  // removeSub(sub) {\r\n  //   const index = this.subs.indexOf(sub);\r\n  //   if(index !== -1) {\r\n  //     this.subs.splice(index, 1)\r\n  //   }\r\n  // }\r\n}\n\n//# sourceURL=webpack:///./src/dep.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _observe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observe */ \"./src/observe.js\");\n/* harmony import */ var _compile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compile */ \"./src/compile.js\");\n\r\n\r\n\r\nfunction MVVM( options = {}) {\r\n  this.$options = options\r\n  const data = this._data = options.data\r\n  // 劫持数据\r\n  Object(_observe__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(data)\r\n  // 将data中的值挂在MVVM上，方便调用\r\n  // eq：vm.xxx -> vm._data.xxx形式\r\n  Object.keys(data).forEach(key => {\r\n    Object.defineProperty(this, key, {      \r\n      configurable:true,\r\n      enumerable:true,\r\n      set(newVal) {\r\n        data[key] = newVal\r\n      },\r\n      get() {\r\n        return data[key]\r\n      }\r\n    })\r\n  })\r\n  new _compile__WEBPACK_IMPORTED_MODULE_1__[\"default\"](options.el || document.body, this)\r\n}\r\n\r\n\r\nwindow.MVVM = MVVM\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/observe.js":
/*!************************!*\
  !*** ./src/observe.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return observe; });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./src/dep.js\");\n\r\n/**\r\n * 劫持数据\r\n * @param {*} data \r\n */\r\n\r\nfunction Observe( data ) {\r\n  Object.keys(data).forEach(key => {\r\n    const dep = new _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\r\n    let val = data[key]\r\n    // 为key对应的值递归绑定\r\n    observe(val)\r\n    // 为所有key绑定setter和getter\r\n    Object.defineProperty(data, key, {\r\n      configurable:true,\r\n      enumerable:true,\r\n      set(newVal) {\r\n        if(val === newVal) return;\r\n        // 因为赋的值可能是对象或数组\r\n        observe(newVal)\r\n        val = newVal\r\n        // 设置新的值就要通知所有订阅者\r\n        dep.notify()\r\n      },\r\n      get() {\r\n        // watcher过来的才会订阅，也就是只有data中的值在dom中应用过才会订阅\r\n        _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target && dep.addSub(_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target) \r\n        return val\r\n      }\r\n    })\r\n  })\r\n}\r\n\r\n// 方便递归调用\r\nfunction observe( data ) {\r\n  if (!data || typeof data !== \"object\") return;   // 防止递归溢出\r\n  return new Observe(data)\r\n}\n\n//# sourceURL=webpack:///./src/observe.js?");

/***/ }),

/***/ "./src/watcher.js":
/*!************************!*\
  !*** ./src/watcher.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return watcher; });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./src/dep.js\");\n\r\n/**\r\n * watch方法\r\n * 链接模板和数据\r\n * 所有模板里面的相应数据都会通过发布订阅模式和data中的数据进行关联，当data里面的数据有变化是才能通知模板里的数据更新\r\n * @param {*} vm 当前实例\r\n * @param {*} exp 通过正则在dom中匹配到的key\r\n * @param {*} cb 数据更改后的回调函数，回调函数是用来更新dom\r\n */\r\nclass watcher{\r\n  constructor(vm, exp, cb) {\r\n    this.vm = vm\r\n    this.exp = exp\r\n    this.cb = cb\r\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = this     // 1、防止dom中同一位置的数据多次订阅，2、方便订阅是拿到此watcher\r\n    this.getVal()\r\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = null\r\n  }\r\n  update() {\r\n    const val = this.getVal()\r\n    this.cb(val)      // 当有数据更新是，通知模板编译（compile.js）那边更新页面\r\n  }\r\n  // 获取key对应的val,此时会触发getter,会将当前的dom对应的watcher放在对应的key所在的发布订阅模式中\r\n  getVal() {\r\n    let val = this.vm\r\n    let arr = this.exp.split(\".\")\r\n    arr.forEach( key => {\r\n      val = val[key]\r\n    })\r\n    return val\r\n  }\r\n}\n\n//# sourceURL=webpack:///./src/watcher.js?");

/***/ })

/******/ });