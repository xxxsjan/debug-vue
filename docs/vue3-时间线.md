# vue3-时间线

入口
core\packages\runtime-dom\src\index.ts

调用createApp

- const app = ensureRenderer().createApp(...args)
  - ensureRenderer()
    - =>createRenderer()
      - => baseCreateRenderer()
      - =>  {
                render,
                hydrate,
                createApp: createAppAPI(render, hydrate)
            }
  - ensureRenderer().createApp(...args) 其实就是上面的createApp
    - 调用createAppAPI(render, hydrate)
      - 返回createApp函数
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
          - mount(
                rootContainer: HostElement,
                isHydrate?: boolean,
                isSVG?: boolean
            ): any { },
          - unmount() { },
          - provide(key, value) { },
          - runWithContext(fn) { }
        - => app 返回
- app.mount
