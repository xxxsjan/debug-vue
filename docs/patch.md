# patch

## vm._c  createElement_createElement   创建vnode

vue/src/core/vdom/create-element.ts

### 设置vm.elm

vue\src\core\vdom\patch.ts

走nodeOps.createElement(tag, vnode)

走nodeOps就是dom操作的api

/vue/src/platforms/web/runtime/node-ops.ts

```js
export function createElement(tagName: string, vnode: VNode): Element {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (
    vnode.data &&
    vnode.data.attrs &&
    vnode.data.attrs.multiple !== undefined
  ) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}
```

#### 设置dom的属性

createElm》invokeCreateHooks》updateAttrs

```js
  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
      cbs.create[i](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode)
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
    }
  }
```

cbs

```js
  const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

```
cbs.create

vue\src\platforms\web\runtime\modules\attrs.ts

上面是一系列方法 

updateAttrs更新属性

![](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202306031609920.png)

updateAttrs

```
for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur, vnode.data.pre)
    }
  }
```



## class VNode

vue\src\core\vdom\vnode.ts

## createElm  创建真实节点

vue\src\core\vdom\patch.ts
