# api时间线

脚本引用时

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
  - initMixin(Vue)
  - initExtend(Vue)
  - initAssetRegisters(Vue)
- Object.defineProperty Vue.prototype, '$isServer'
- Object.defineProperty Vue.prototype, '$ssrContext'
- Object.defineProperty Vue, 'FunctionalRenderContext',
- Vue.version

-
