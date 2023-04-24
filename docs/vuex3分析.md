# vuex3分析

## 入口

vuex3\src\index.js

## 使用

<https://v3.vuex.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF-%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F>

## install

混入beforeCreate

```
Vue.mixin({ beforeCreate: vuexInit })
function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 根上会有store
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 其他组件只需沿着parent获取即可
      this.$store = options.parent.$store
    }
  }
```

## new Vuex.Store

### 使用

```
// 声明
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
// 使用
new Vue({
  el: '#app',
  store,
  render: h => h(Counter)
})

// 使用
this.$store.state
store.getters.doneTodos
store.commit('increment', 10)
store.dispatch('products/getAllProducts')
this.$store.state.products.all

```

## 分析用法

根级state的都会放到store上，比如state getter mutations actions

对于模块的，会添加到store.state上

对于嵌套的modules会挂到父级模块下

对于未开启命名空间的模块，actions mutations是直接 commit dispatch触发的

对于开启了命名空间的模块，调取commit dispatch需要使用命名划分

要使用custom模块的add，this.$store.commit("add");
假如使用了命名空间，就是this.$store.commit("custom/add");

```
export default new Vuex.Store({
  modules: {
    cart,
    products,
    custom: {
      state: { ccc: 111 },
      mutations: {
        add(state, payload) {
          state.ccc++;
        },
      },
    },
  },
});

```
