# vue2使用原生onkeyup的问题



## 测试代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="../vue/dist/vue.js"></script>
  </head>
  <body>
    <div id="app">
      <input v-model="val" onkeyup="onKeyup()" />
    </div>
    <script>
      new Vue({
        el: "#app",
        data: {
          val: "0",
        },
        methods: {
          onKeyup() {},
        },
      });
    </script>
  </body>
</html>

```

## 问题

这样写会报错：Uncaught ReferenceError: onKeyup is not defined

## 原因分析

### vue2模板解析后的ast

![image-20230507204016816](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202305072040217.png)

可以看到ast并没有在event里生成keyup对象

### 函数体code

![image-20230507200418470](https://raw.githubusercontent.com/xxxsjan/pic-bed/main/202305072004990.png)

```
"with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(val),expression:"val"}],attrs:{"onkeyup":"onKeyup()"},domProps:{"value":(val)},on:{"input":function($event){if($event.target.composing)return;val=$event.target.value}}})])}"
```

ast没keyup事件，自然而然，函数体里面

onkeyup也会是放在attrs里面

理论上他是应该放到  on对象里面，和v-model的默认事件input一起的

所以当执行到onKeyup()，会报undefined









