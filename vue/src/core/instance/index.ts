import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'

function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化
  this._init(options)
}

// 一系列包装函数 Vue.prototype
//@ts-expect-error Vue has function type
initMixin(Vue) // Vue.prototype._init
//@ts-expect-error Vue has function type
stateMixin(Vue) // Vue.prototype.$set $delete $watch
//@ts-expect-error Vue has function type
eventsMixin(Vue) // Vue.prototype.$on $once $off $emit
//@ts-expect-error Vue has function type
lifecycleMixin(Vue) // Vue.prototype._update $forceUpdate $destroy
//@ts-expect-error Vue has function type
renderMixin(Vue) // Vue.prototype.$nextTick _render

export default Vue as unknown as GlobalAPI
