# 记录

## Observer

组件的data会生成Observer实例，放到自身__ob__上

## Dep

对于data上的key，每一个都会通过defineReactive生成一个dep

dep主要就是用来在get时触发watcher的收集

在属性set时，调用dep.notify，遍历执行收集的subs，里面都是watcher实例，调用watcher.run()

## Watcher

以组件watch初始举例

会为每个key创建一个Watcher

new Watcher时 watch的lazy默认为false，会执行get方法

get方法

get又会执行getter方法

由于watch初始化时传入Watcher的expOrFn是key，是一个字符串

constructor初始化时，getter会生成一个读取key的函数，从而达到依赖收集的目的

```javascript
// constructor
if (isFunction(expOrFn)) {
      // 计算属性时 expOrFn 会是函数
      this.getter = expOrFn
    } else {
      // 组件中watch初始化时 expOrFn 是key 也就是字符串
      // 解析watch的key，可能会有 'obj.a' 的情况 ，生成getter
      //  parsePath 主要就是根据解析，去访问对应属性，触发对象的get
      this.getter = parsePath(expOrFn)

}
 get() {
    // targetStack栈追加当前实例watcher，Dep.target设置为当前实例watcher
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      debugger
      // 这里调用会触发依赖收集
      value = this.getter.call(vm, vm)
    } catch (e: any) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // 深度监听
      if (this.deep) {
        traverse(value)
      }
      // targetStack栈上移除最后一个，也就是之前追加当前实例watcher，Dep.target设置为targetStack栈的最后一个
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
```

watcher收集依赖时，Dep.target会设置为当前实例

会调用depend，

depend又会调用Dep.target.addDep，并把dep实例作为参数传下去

Dep.target.addDep即为watcher上的addDep方法

接收到dep实例 ,拿出dep的id，添加到newDepIds，newDeps上
同时也会把自己（watcher实例），传给dep实例的addSub方法

```javascript
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
```

dep.addSub
添加subs数组，这样watcher与dep就相互建立了联系

```javascript
 addSub(sub: DepTarget) {
    this.subs.push(sub)
 }
```
