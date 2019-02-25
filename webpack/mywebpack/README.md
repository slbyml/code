##  手写webpack
再`package.json`中的`bin`中配置如下
```
"bin": {
    "mywebpack": "./bin/mywebpack.js"
  }
```
此时如果想在命令行中输入`mywebapck`来直接js文件可以输入`npm link`这样就会再全局下生成mywebpack命令，然后再全局控制台下输入`mywebapck`就可以执行`bin`里面写的js文件了