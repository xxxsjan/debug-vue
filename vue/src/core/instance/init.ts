import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'
import type { Component } from 'types/component'
import type { InternalComponentOptions } from 'types/options'
import { EffectScope } from 'v3/reactivity/effectScope'

let uid = 0

export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function (options?: Record<string, any>) {
    const vm: Component = this
    // 设置组件的uid，每个组件都不一样
    vm._uid = uid++

    // 性能检测相关代码，标记开始
    let startTag, endTag
    if (__DEV__ && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // 方便判断当前是vue实例的标志，后续不用instanceOf判断
    vm._isVue = true
    // 避免被观察
    vm.__v_skip = true

    // effect scope
    vm._scope = new EffectScope(true /* detached */)
    vm._scope._vm = true

    // 合并options 处理各种option的问题
    // 组件名、选项的值统一使用一种结构，比如自定义指令写成函数的要格式化成对象结构
    if (options && options._isComponent) {
      // 优化内部组件的实例化过程，因为动态选项合并非常缓慢，而且不需要对任何内部组件选项进行特殊处理
      initInternalComponent(vm, options as any)
    } else {
      // 首次初始化的组件走这里，和合并父级组件的options
      // 参数：parent child vm
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor as any),
        options || {},
        vm
      )
    }

    // 如果是开发环境，就创建proxy对象代理组件对象，不是的话直接访问
    // tip：代理对象的作用是将组件实例内部的属性和方法进行封装，以便在访问时可以进行一些额外的处理
    if (__DEV__) {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // 存一份当前的实例
    vm._self = vm
    /**
     * 初始化组件实例生命周期
     * 初始vm的$parent $refs
     *         _provided _watcher
     *         _inactive _directInactive
     *         _isMounted_isDestroyed _isBeingDestroyed
     */
    initLifecycle(vm)
    // 初始化组件实例事件
    initEvents(vm)
    // 初始化组件实例渲染  设置一些属性 _vnode _staticTrees $slots $scopedSlots _c $createElement
    initRender(vm)
    // 生命周期beforeCreate的执行时机
    // 参数： vm: Component,  hook: string, args?: any[],  setContext = true
    callHook(vm, 'beforeCreate', undefined, false /* setContext */)
    // 初始化注入属性  在data/props之前
    initInjections(vm)
    // 初始化data props
    initState(vm)
    // 初始化提供属性 在data/props之后
    initProvide(vm)
    // 生命周期created的执行时机
    callHook(vm, 'created')

    // vue框架做性能检测的相关代码  标记结束
    if (__DEV__ && config.performance && mark) {
      // 将当前组件实例的名称格式化为字符串，并将其存储到 _name 属性中
      vm._name = formatComponentName(vm, false)
      // 记录一个结束标记
      mark(endTag)
      // 计算组件实例初始化所消耗的时间 startTag 和 endTag 分别代表开始和结束的标记名称
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    // 如果设置了el，就挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create((vm.constructor as any).options))
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions!
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions(Ctor: typeof Component) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions(
  Ctor: typeof Component
): Record<string, any> | null {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
