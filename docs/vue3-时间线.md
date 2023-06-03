# vue3-时间线

入口
core\packages\runtime-dom\src\index.ts

调用createApp(..args)

- const app = ensureRenderer().createApp(...args)
  - ensureRenderer() => {render,hydrate,createApp}
    - =>createRenderer() 返回createRenderer函数
      - => baseCreateRenderer() 返回结果值
      - =>  {
                render,
                hydrate,
                createApp: createAppAPI(render, hydrate)
            }
  - ensureRenderer().createApp(...args) 其实就是上面baseCreateRenderer()的createApp  args是用户用过createApp传入的
    - 调用createAppAPI(render, hydrate)  render是baseCreateRenderer内部声明的函数
      - 返回createApp函数
      - 调用createApp函数
        - const context = createAppContext()
        - => {
                app: null as any,
                config: {
                isNativeTag: NO,
                performance: false,
                globalProperties: {},
                optionMergeStrategies: {},
                errorHandler: undefined,
                warnHandler: undefined,
                compilerOptions: {}
                },
                mixins: [],
                components: {},
                directives: {},
                provides: Object.create(null),
                optionsCache: new WeakMap(),
                propsCache: new WeakMap(),
                emitsCache: new WeakMap()
            }
        - 设置contest.app
          - _uid: uid++,
          - _component: rootComponent as ConcreteComponent,
          - _props: rootProps,
          - _container: null,
          - _context: context,
          - _instance: null,
          - version,
          - get config() {  },
          - set config(v) { },
          - use(plugin: Plugin, ...options: any[]) { },
          - mixin(mixin: ComponentOptions) { },
          - component(name: string, component?: Component): any { },
          - directive(name: string, directive?: Directive) { },
          - mount(rootContainer: HostElement,isHydrate?: boolean,isSVG?: boolean): any,
            - createVNode
            - render(vnode, rootContainer, isSVG)  render是baseCreateRenderer内部声明的函数
              - unmount(container._vnode, null, null, true)
              - patch(container._vnode || null, vnode, container, null, null, null, isSVG)
          - unmount() { },
          - provide(key, value) { },
          - runWithContext(fn) { }
        - => app 返回
- app.mount
