# mounted之前都做了什么

> 参考vue-api时间线，可以根据具体知道

首先 触发_init

在vm上设置一些后续会用到的值，设置初始值

beforeCreate

初始inject initInjections
初始状态 initState 包括响应式实现和代理数据
初始provider initProvide

create

进入template的解析，最后生成render函数

调用mount进入挂载阶段

调用mountComponent开始挂载组件

beforeMount

生成渲染watcher，触发getter，也就是触发updateComponent

updateComponent执行render函数生成vnode

updateComponent执行_update函数

调用__patch__进行页面操作

mounted
