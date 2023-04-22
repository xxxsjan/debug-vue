import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'
import { CompilerOptions, CompiledResult } from 'types/compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  // options 为createCompilerCreator内部生成的最终options --finalOptions

  // 解析生成ast
  const ast = parse(template.trim(), options)

  // 优化ast  添加静态节点标识
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 生成可执行代码 {staticRenderFns:[], render:'with(this){return _c('div',{attrs:{"id":"demo"}},[_c('div',[_v("aaaaaa--"+_s(a))]),_v(" "),_c('div',[_v("bbbbbb--"+_s(b))]),_v(" "),_c('button',{on:{"click":tap}},[_v("tap")])])}'}
  const code = generate(ast, options)
  // 返回结果
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
