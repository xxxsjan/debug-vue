import { isFunction, warn } from 'core/util'
import { currentInstance } from './currentInstance'
import type { Component } from 'types/component'

export interface InjectionKey<T> extends Symbol {}

export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
  if (!currentInstance) {
    if (__DEV__) {
      warn(`provide() can only be used inside setup().`)
    }
  } else {
    // TS doesn't allow symbol as index type
    resolveProvided(currentInstance)[key as string] = value
  }
}

export function resolveProvided(vm: Component): Record<string, any> {
  // by default an instance inherits its parent's provides object
  // but when it needs to provide values of its own, it creates its
  // own provides object using parent provides object as prototype.
  // this way in `inject` we can simply look up injections from direct
  // parent and let the prototype chain do the work.

  // initLifecycle时初始 vm._provided = parent ? parent._provided : Object.create(null)

  const existing = vm._provided // 实例的提供对象_provided

  const parentProvides = vm.$parent && vm.$parent._provided // 父组件的提供对象

  // 判断两者是否一样
  if (parentProvides === existing) {
    // 如果一样，当前实例只需以父组件的提供对象为原型创建新对象即可，并返回
    return (vm._provided = Object.create(parentProvides))
  } else {
    // 如果不是，优先使用组件自己的提供对象，并返回
    return existing
  }
}

export function inject<T>(key: InjectionKey<T> | string): T | undefined
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false
): T
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true
): T
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false
) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance
  if (instance) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the instance is at root
    const provides = instance.$parent && instance.$parent._provided

    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string]
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`)
  }
}
