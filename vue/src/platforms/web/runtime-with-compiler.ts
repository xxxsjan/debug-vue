import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref
} from './util/compat'
import type { Component } from 'types/component'
import type { GlobalAPI } from 'types/global-api'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// full-dev用这个$mount
const mount = Vue.prototype.$mount // 这个声明在vue\src\platforms\web\runtime\index.ts
// 这两个不是一个东西啊
// Vue.prototype.$mount重新赋值
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean // 用于服务端渲染的参数
): Component {
  // 格式化成HTMLElement
  el = el && query(el)

  // 开发警告：不能使用body和html标签作为挂载节点
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    __DEV__ &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }
  // 创建快速使用变量
  const options = this.$options

  // 无render函数，则进行template解析
  if (!options.render) {
    let template = options.template
    // 如果声明了template属性
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (__DEV__ && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (__DEV__) {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 无template属性 根据el获取el的outerHTML
      // @ts-expect-error
      template = getOuterHTML(el)
    }
    // template已有值。是dom的字符串
    if (template) {
      // 性能检测相关
      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile')
      }
      //  一顿操作 参数会传到compileToFunctions
      // compileToFunctions
      // ->createCompiler 入参baseOptions
      //  ->createCompilerCreator 高阶函数，返回createCompiler函数给上一步的createCompiler变量
      //   ->createCompiler --createCompilerCreator返回的函数，上面createCompiler就是这个返回的，所以设置名字一样
      //                    --函数作用：基于baseOptions生成compile
      //    -> createCompileToFunctionFn  形参1：compile
      //     -> compileToFunctions 使用compile解析template
      //         ->compile
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: __DEV__,
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters, // 分隔符
          comments: options.comments
        },
        this
      )
      // 放到this.$options上
      options.render = render
      options.staticRenderFns = staticRenderFns
      // 性能检测相关 结束标记
      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }

  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue as GlobalAPI
