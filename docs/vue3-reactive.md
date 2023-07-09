# vue3-reactive

- createAppContext
  - mount
    - render

- patch

## ref

core\packages\reactivity\src\ref.ts

ref
  => createRef
  => new RefImpl(rawValue, shallow)  
  => this._value =toReactive
  => reactive(value)

响应式创建发生在 app.mount 中的 createApp
=> core\packages\runtime-core\src\apiCreateApp.ts

- createApp 返回 app对象
  - app对象上的mount执行
  - mount里执行render(vnode, rootContainer, isSVG)触发渲染
  - render （unmount patch flushPreFlushCbs flushPostFlushCbs）调用patch
  - patch 根据type 走switch  core\packages\runtime-core\src\renderer.ts - patch
  - 走default processComponent
  - mountComponent < processComponent
  - createComponentInstance 创建组件实例 < mountComponent
  - setupComponent < mountComponent
  - setupStatefulComponent 调用setup < setupComponent < mountComponent
  - callWithErrorHandling < setupStatefulComponent < setupComponent < mountComponent
