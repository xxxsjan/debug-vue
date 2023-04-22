# Watcher的种类

## 源码

```javascript
class Watcher {
     constructor(
    vm: Component | null,
    expOrFn: string | (() => any),
    cb: Function,
    options?: WatcherOptions | null,
    isRenderWatcher?: boolean
  ) {
    recordEffectScope(
      this,
      // if the active effect scope is manually created (not a component scope),
      // prioritize it
      activeEffectScope && !activeEffectScope._vm
        ? activeEffectScope
        : vm
        ? vm._scope
        : undefined
    )
    if ((this.vm = vm) && isRenderWatcher) {
      vm._watcher = this
    }
    // options  计算属性时 lazy默认为true
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
      if (__DEV__) {
        this.onTrack = options.onTrack
        this.onTrigger = options.onTrigger
      }
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.post = false
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = __DEV__ ? expOrFn.toString() : ''
    // parse expression for getter
    if (isFunction(expOrFn)) {
      // 计算属性时 expOrFn 会是函数
      // 渲染组件时 也是函数 updateComponent
      this.getter = expOrFn
    } else {
      // 组件中watch初始化时 expOrFn 是key 也就是字符串
      // 解析watch的key，可能会有 'obj.a' 的情况 ，生成getter
      //  parsePath 主要就是根据解析，去访问对应属性，触发对象的get
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        __DEV__ &&
          warn(
            `Failed watching path: "${expOrFn}" ` +
              'Watcher only accepts simple dot-delimited paths. ' +
              'For full control, use a function instead.',
            vm
          )
      }
    }
    // 计算属性一开始不会有值
    this.value = this.lazy ? undefined : this.get()
  }
}
```

根据expOrFn isRenderWatcher 两个参数可知

expOrFn 可为字符串或者函数
isRenderWatcher 布尔值，是否渲染Watcher

## expOrFn

### 字符串

组件watch时，会出现，比如

```
watch:{
'obj.a':function(){}
}
```

### 函数

计算属性或者渲染watcher时会出现

```
computed
// 为computed属性创建内部watcher
watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
)
渲染watcher时
new Watcher(
    vm,
    updateComponent,
    noop,
    watcherOptions,
    true /* isRenderWatcher */
)
```
