# vue2-v-model过程

## html模板

```html
<div id="app">
 <p>静态节点</p>
 <div>{{msg}}</div>
 <input type="text" v-model="a" />
</div>
```



## 先调用parse函数

parse函数调用parseHTML

parseHTML里面对于标签的解析会调用starts回调

starts回调处理每次遇到开始标签的结果

end回调处理每次遇到结束标签的结果

parse函数最后返回root，也就是最后处理完成的ast

![image-20230427122100169](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271232749.png)



AST通过generate(ast, options) 生成函数体字符串

![image-20230427123229653](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271232665.png)



再经过createCompileToFunctionFn转成render函数

![image-20230427123645541](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271236463.png)

下一步进入挂载之前阶段

new Watcher，由于是渲染watcher，调用getter，也就是updateComponent

```javascript
 updateComponent = () => {
      // vm._render()生成vnode在实例上 期间会收集依赖
      // vm._update 拿到虚拟节点，新旧对比渲染
      vm._update(vm._render(), hydrating)
    }
}
```

执行vm._render()就是调用之前生成的render函数

这时会触发数据劫持的get，会把当前渲染watcher进行依赖收集

## _render执行



![image-20230427124514752](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271245328.png)

递归调用`__patch__`

输出结果vnode 包含数据

#### v-model节点的vnode

![image-20230427124632838](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271246506.png)



### 具体过程

patch过程

会调用 updateDirectives对于指令的解析

v-model以及自定义的指令的初始化就在这里发生

在render执行生成vnode期间完成

多种写法会格式化后放到newDirs对象里

可以看到def里面就是指令的钩子

知识回顾：Vue2 自定义指令中常用的钩子函数

1. `bind`：只调用一次，在指令绑定到元素上时调用，可以进行一些初始化操作。
2. `inserted`：在被绑定的元素插入到父节点时调用，常用于dom操作。
3. `update`：当被绑定的元素所在的模板更新时调用，而不论绑定值是否变化。
4. `componentUpdated`：在被绑定元素及其子元素全部更新后调用。
5. `unbind`： 只调用一次，在指令与元素解绑时调用，可以进行一些清理工作

![image-20230427135532213](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271355823.png)

执行钩子

![image-20230427141635825](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271416844.png)

可以看到，关键点在于callhook或者mergeVNodeHook(vnode, 'insert', callInsert)

#### mergeVNodeHook

初次创建的话是mergeVNodeHook(vnode, 'insert', callInsert)

mergeVNodeHook作用就是在vnode.data.hook上挂上callInsert的方法

![image-20230427144347182](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271443112.png)

#### callhook

而callhook（这个callhook不是vue生命周期那个callhook）

传了四个参数：指令钩子函数，钩子的名字，新vnode，旧vnode

```javascript
function callHook(dir, hook, vnode, oldVnode, isDestroy?: any) {
  const fn = dir.def && dir.def[hook]
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy)
    } catch (e: any) {
      handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`)
    }
  }
}
```

可以看到调用了fn，即传入了指令钩子中常用的el，binging，vnode等参数

小结：

初次创建不会立即执行指令钩子，而是会放在vnode.data.hook里，放到后面流程

如果以及创建则会执行callInsert

如果是组件更新

则是走mergeVNodeHook，把执行放到postpatch，patch后执行



### patch-createElm

input的vnode  这时已经有数据，只需要渲染到对应位置即可

![image-20230427125946376](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202304271259215.png)



#### insert(parentElm, vnode.elm, refElm)

更新dom