# api时间线

## 脚本引用时

- initMixin(Vue)  
  
- Vue.prototype._init
  
- stateMixin(Vue)  
  - Object.defineProperty(Vue.prototype, '$data', dataDef)
  - Object.defineProperty(Vue.prototype, '$props', propsDef)
  - Vue.prototype.$set
  - Vue.prototype.$delete
  - Vue.prototype.$watch

- eventsMixin(Vue)  
  - Vue.prototype.$on
  - Vue.prototype.$once
  - Vue.prototype.$off
  - Vue.prototype.$emit
  
- lifecycleMixin(Vue)  
  - Vue.prototype._update
  - Vue.prototype.$forceUpdate
  - Vue.prototype.$destroy
  
- renderMixin(Vue)  
  
  - installRenderHelpers(Vue.prototype)  vue\src\core\instance\render-helpers\index.ts
  
    -  Vue.prototype._o = markOnce
  
       Vue.prototype._n = toNumber
    
       Vue.prototype._s = toString
    
       Vue.prototype._l = renderList
    
       Vue.prototype._t = renderSlot
    
       Vue.prototype._q = looseEqual
    
       Vue.prototype._i = looseIndexOf
    
       Vue.prototype._m = renderStatic
    
       Vue.prototype._f = resolveFilter
    
       Vue.prototype._k = checkKeyCodes
    
       Vue.prototype._b = bindObjectProps
    
       Vue.prototype._v = createTextVNode
    
       Vue.prototype._e = createEmptyVNode
    
       Vue.prototype._u = resolveScopedSlots
    
       Vue.prototype._g = bindObjectListeners
    
       Vue.prototype._d = bindDynamicKeys
    
       Vue.prototype._p = prependModifier
    
  - Vue.prototype.$nextTick
  
  - Vue.prototype._render
  
- initGlobalAPI(Vue)
  - Object.defineProperty(Vue, 'config', configDef)
  - Vue.util
  - Vue.set
  - Vue.delete
  - Vue.nextTick
  - Vue.observable
  - Vue.options
  - Vue.options._base
  - extend(Vue.options.components, builtInComponents)
  - initUse(Vue)
    - Vue.use
  - initMixin(Vue)
    - Vue.mixin
  - initExtend(Vue)
    - Vue.extend
  - initAssetRegisters(Vue)
    - Vue['component', 'directive', 'filter']
  
- Object.defineProperty Vue.prototype, '$isServer'

- Object.defineProperty Vue.prototype, '$ssrContext'

- Object.defineProperty Vue, 'FunctionalRenderContext',

- Vue.version

## new Vue

- Vue.prototype._init
  - vm._uid
  - vm._isVue
  - vm.__v_skip
  - vm._scope
  - vm._scope._vm
  - options._isComponent
    ? initInternalComponent(vm, options as any)
    : vm.$options --mergeOptions
  - vm._renderProxy
    - = vm
    - initProxy(vm)
  - vm._self
  - initLifecycle(vm)
  - initEvents(vm)
  - initRender(vm)
  - callHook(vm, 'beforeCreate', undefined, false)------beforeCreate
  - initInjections(vm)
  - initState(vm)
  - initProvide(vm)
  - callHook(vm, 'created')---------------created
  - vm.$mount(vm.$options.el)
    - template 格式化
      - idToTemplate
      - getOuterHTML(el)
      
    - {render, staticRenderFns} = compileToFunctions(template,options,this)

      - 高阶函数不好说 具体：vue\src\platforms\web\runtime-with-compiler.ts
      - 主要就是拿到了render函数，render函数可以返回vnode
        - 具体步骤
        - 调用createCompileToFunctionFn ，有闭包维护缓存  const cache = Object.create(null)
        - createCompileToFunctionFn 里面调用compile函数
        - compile函数先生成finalOptions
        - compile里面继续调用baseCompile(template.trim(), finalOptions)返回compiled （结果）
          - baseCompile 里 调用 parse(template.trim(), options) 生成 AST
          - baseCompile 里 调用generate(ast, options) 生成 code:{staticRenderFns:[], render:"with(this){...}"}
          - baseCompile 返回 {ast,  render: code.render,  staticRenderFns: code.staticRenderFns}
            - parse具体流程
            - 调用parseHTML解析template字符串，每遇到开始 结束标签，触发回调，回调会处理生成结果，最后返回
      - 模板解析的最终结果是输出 render, staticRenderFns，render函数在后面组件挂载时执行，达到渲染目的

      

    - mount.call(this, el, hydrating)
      - mountComponent(this, el, hydrating)
        - vm.$options.render
        - callHook(vm, 'beforeMount')

        - new Watcher(vm,updateComponent,noop
          watcherOptions,true)
          - updateComponent
            - 执行vm._update(vm._render(), hydrating)
              - vm._render()
                - vnode = render.call(vm._renderProxy, vm.$createElement)
                - render作用输出虚拟节点

        - ? vm._preWatchers
          - preWatchers[i].run()
        - callHook(vm, 'mounted')
