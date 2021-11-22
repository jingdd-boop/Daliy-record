<!--
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-15 17:17:04
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-22 15:05:29
-->

前端路由

- 什么是前端路由？
- hash 和 history 两种路由有什么区别？
- 两个路由的原理是什么？
- 使用的场景是什么？
- 各自的优点？ 单页面相关？？
- vue react 前端路由的应用？

一、什么是前端路由
路由就是用来跟后端服务器进行交互的一种方式，通过不同的路径，来请求不同的资源，请求不同的页面是路由的其中一种功能

路由的概念来源于服务端，在服务端中路由描述的是 URL 与处理函数之间的映射关系。
在 Web 前端单页应用 SPA(Single Page Application)中，路由描述的是 URL 与 UI 之间的映射关系，这种映射是单向的，即 URL 变化引起 UI 更新（无需刷新页面）。

- 前端路由的出现要从 ajax 开始，ajax 是浏览器用来实现异步加载的一种技术方案。之前，大多数网站都是直接返回 HTML 文档，用户每次更新操作都需要重新刷新页面，极大影响了用户体验。
- 为了提高用户体验，微软首先提出 iframe 标签，iframe 带来了异步加载和请求元素的概念，之后有提出 Ajax 的基本概念（XMLHttpRequest 的前身）
- 有了 Ajax 后，用户交互就不用每次都刷新页面，体验带来了极大的提升。
- 异步交互体验的更高级版本就是 SPA—— 单页应用

单页应用不仅仅是在页面交互是无刷新的，连页面跳转都是无刷新的，为了实现单页应用，所以就有了前端路由。

前端路由实现本质：
本质上就是检测 url 的变化，截获 url 地址，然后解析来匹配路由规则。

因此要实现前端路由，需要解决两个核心：

- 如何改变 URL 却不引起页面刷新？
- 如何检测 URL 变化了？

或许你会问：url 每次变化都会刷新页面啊？页面都刷新了，JavaScript 怎么检测和截获 url？

下面一起来看看两种路由的特点：

1.1 分类-Hash

原理：

- hash 是 URL 中 hash (#) 及后面的那部分，常用作锚点在页面内进行导航，改变 URL 中的 hash 部分不会引起页面刷新
- 通过 hashchange 事件监听 URL 的变化，改变 URL 的方式只有这几种：通过浏览器前进后退改变 URL、通过`<a>`标签改变 URL、通过 window.location 改变 URL，这几种情况改变 URL 都会触发 hashchange 事件

当通过 hash 来实现路由，url hash 就是类似于` https://jing.com/a/1190000011956628#home`

1. 这种 `#`。后面 hash 值的变化，并不会导致浏览器向服务器发出请求，
2. 浏览器不发出请求，也就不会刷新页面。
3. 另外每次 hash 值的变化，还会触发 `hashchange` 这个事件，
4. 通过这个事件我们就可以知道 hash 值发生了哪些变化。

假如我们要用 hash 的模式实现一个路由`（https://jing.io/jingda-router -> https://jing.io/jingda-router/#/home）`，应该需要经过以下流程：

URL 接口的 hash 属性返回一个 USVString，其中会包含 URL 标识中的 '#' 和 fragment 标识符（fragment 即我们通常所说的 URL hash）

```js
var url = new URL(
  "https://developer.mozilla.org/en-US/docs/Web/API/URL/href#Examples"
);
url.hash; // Returns '#Examples'
```

1.2 分类-history
原理：

- history 提供了 pushState 和 replaceState 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新
- history 提供类似 hashchange 事件的 popstate 事件，但 popstate 事件有些不同：通过浏览器前进后退改变 URL 时会触发 popstate 事件，通过 pushState/replaceState 或`<a>`标签改变 URL 不会触发 popstate 事件。好在我们可以拦截 pushState/replaceState 的调用和`<a>`标签的点击事件来检测 URL 变化，所以监听 URL 变化可以实现，只是没有 hashchange 那么方便。

下面我们将会通过一些方式去实现这两种前端路由，在实现之前，来看看他们的一些特点

hash：

1. url 中的 hash 值只是客户端的一种状态，也就是说当向服务器发出请求时，hash 部分不会被发送
2. hash 值的改变，都会在浏览器的访问历史中增加一个记录，因此我们能通过浏览器的回退，前进按钮控制 hash 的切换
3. 可以通过设置 a 标签，并通过设置 href 属性，例如 href = '#/blue',当点击标签的时候，url 的 hash 值发生改变，在当前 url 的后面加上‘#/bule’,同时触发 hashChange，再回调函数中进行处理
4. 前进后退的时候，直接通过 js 来对 location.hash 进行赋值，改变 url 的 hash 值，例如 location.hash = ‘#/blue’即可，此时 url 会改变，也会触发 hashChange 事件
5. 因此我们可以使用 hashChange 事件来监听值得变化，从而对页面进行跳转（渲染）

history:

1. HTML5 提供了 HistoryAPI 来实现 URL 的变化，其中最主要的 API 有
   - history.pushState() 新增一个历史记录；
   - history.replaceState() 直接替换当前历史记录；
2. 介绍一下这两个方法 history.pushState / replaceState 方法接受三个参数，依次为：
   state:一个与指定网址相关的状态对象，popstate 事件触发时，该对象会传入回调函数。如果不需要这个对象，此处可以填 null。title：新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填 null。url：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

```js
eg: window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

3.history 路由模式的实现主要基于以下几个方面的特性
3.1、pushState / replaceState 两个 API 来操作实现 URL 的变化；
3.2、我们可以使用 popstate 事件来监听 URL 的变化，从而对页面进行跳转（渲染）；
3.3、pushState / replaceState 或 `<a>` 标签 并不会触发 popstate 事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用 back，forward，go 方法时才会触发，好在我们可以拦截 pushState/replaceState 的调用和 a 标签的点击事件来检测 URL 变化 所以我们需要手动触发页面跳转（渲染）；

history 模式的一些问题

1.history 路由模式虽然好看，但是这种模式要玩儿好，还需要后台配置支持，因为我们的应用是个单页的客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问一些没有配置的路径就会返回 404，但因为没有 # 号，所以当用户刷新页面之类的操作时，浏览器还是会给服务器发送请求。为了避免出现这种情况，所以这个实现需要服务器的支持，需要把所有路由都重定向到根页面；

2.所以呢，你要在服务端增加一个覆盖所有情况的候选资源，如果 URL 匹配不到任何静态资源，应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面；

二、javascript 原生方法实现路由？
效果图

2.1 hash

```html
<!--
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-15 17:45:27
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-22 14:13:50
-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>前端路由</title>
  </head>
  <body>
    <h1>hello , Hash router!!!</h1>
    <div style="margin-bottom:100px">
      <ul>
        <li><a href="#/">turn white</a></li>
        <li><a href="#/blue">turn blue</a></li>
        <li><a href="#/green">turn green</a></li>
      </ul>
      <button id="btn">回退</button>
      <div id="app" style="margin-top:50px;height:100px"></div>
    </div>

    <script>
      function render() {
        app.innerHTML = "渲染容器" + window.location.hash;
        app.style.backgroundColor = "pink";
      }
      window.addEventListener("hashchange", render);
    </script>
    <script src="./js/router.js"></script>
  </body>
</html>
```

```js
/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-15 17:45:32
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-22 14:33:12
 */
class Router {
  constructor() {
    /**
     * 以键值对的形式存储路由
     */
    this.routers = new Object();
    /**
     * 当前路由的URL
     */
    this.currentUrl = "";
    /**
     * 记录出现过的hash
     */
    this.history = [];
    /**
     * 作为指针,默认指向this.history的末尾,根据后退前进指向history中不同的hash
     */
    this.currentIndex = this.history.length - 1;
    /**
     * 默认不是后退操作
     */
    this.isBack = false;
  }
  /**
   * 都定义在原型上，后面的覆盖前面的，这个不执行
   */
  route(path, callback) {
    console.log(1);
  }
}

/**
 * 将路由的hash以及对应的callback函数储存
 * @param {*} path
 * @param {*} callback
 */
Router.prototype.route = function (routes) {
  for (let route of routes) {
    this.routers[route.path] = route.callback || function () {};
  }
};

/**
 * 当页面刷新的时候
 */
Router.prototype.refresh = function () {
  /**
   * 获取当前页面中的hash路径
   */
  this.currentUrl = window.location.hash.slice("1") || "/";
  /**
   * 不是后退才执行
   */
  if (!this.isBack) {
    if (this.currentIndex < this.history.length - 1)
      this.history = this.history.slice(0, this.currentIndex + 1);
    /**
     * 将当前hash路由推入数组储存,指针向前移动
     */
    this.history.push(this.currentUrl);
    this.currentIndex++;
  }
  this.isBack = false;
  /**
   * 执行当前hash路径的回调函数
   */
  this.routers[this.currentUrl]();
  console.log("refresh");
  console.log(this.history);
  console.log(this.currentIndex);
};

/**
 * 当页面后退,回退的过程中会触发hashchange,将hash重新放入，索引增加
 */
Router.prototype.back = function () {
  console.log("back");
  console.log(this.history);
  console.log(this.currentIndex);
  // 后退操作设置为true
  this.isBack = true;
  /**
   * 如果指针小于0的话就不存在对应hash路由了,因此锁定指针为0即可
   */
  this.currentIndex <= 0
    ? (this.currentIndex = 0)
    : (this.currentIndex = this.currentIndex - 1);
  /**
   * 随着后退,location.hash也应该随之变化
   * 并执行指针目前指向hash路由对应的callback
   */
  location.hash = `#${this.history[this.currentIndex]}`;
  this.routers[this.history[this.currentIndex]]();
};

/**
 * 初始化，监听页面的加载与hash只的变化
 */
Router.prototype.init = function () {
  /**
   * 修改this指向，否则指向window
   */
  window.addEventListener("load", this.refresh.bind(this), false);
  window.addEventListener("hashchange", this.refresh.bind(this), false);
};

const route = new Router();
/**
 * 初始化
 */
route.init();
const routes = [
  {
    path: "/",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "#fff";
    },
  },
  {
    path: "/blue",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "blue";
    },
  },
  {
    path: "/green",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "green";
    },
  },
];
/**
 * 将hash值与cb绑定
 */
route.route(routes);
window.onload = function () {
  let btn = document.getElementById("btn");
  btn.addEventListener("click", route.back.bind(route), false);
};
```

2.2 history

```html
<!--
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-22 14:36:51
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-22 14:38:45
-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>前端路由</title>
  </head>
  <body>
    <h1>hello , History router!!!</h1>
    <ul>
      <li><a href="/">turn white</a></li>
      <li><a href="http://localhost:3001/color/blue">turn blue</a></li>
      <li><a href="http://localhost:3001/color/green">turn green</a></li>
      <li><a href="http://localhost:3001/color/red">turn red</a></li>
    </ul>

    <script src="./js/history.js"></script>
  </body>
</html>
```

```js
/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-22 14:36:57
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-22 14:38:58
 */
/**
 * history路由
 */
class Router {
  constructor() {
    /**
     * 以键值对的形式存储路由
     */
    this.routers = new Object();
  }
}

/**
 * 监听页面的popstate事件
 */
Router.prototype.bindPopState = function (e) {
  const path = e.state && e.state.path;
  this.routers[path] && this.routers[path]();
};

/**
 * 将路由的path以及对应的callback函数储存
 * @param {*} path
 * @param {*} callback
 */
Router.prototype.route = function (routes) {
  for (let route of routes) {
    this.routers[route.path] = route.callback || function () {};
  }
};

/**
 * 初始化，直接替换当前历史纪录，并用状态对象进行存储
 */
Router.prototype.init = function (path) {
  window.history.replaceState({ path: path }, null, path);
  this.routers[path] && this.routers[path]();
  /**
   * 加入事件监听
   */
  window.addEventListener("popstate", this.bindPopState.bind(this), false);
};

/**
 * 更新页面，新增一个历史纪录
 */
Router.prototype.go = function (path) {
  window.history.pushState({ path: path }, null, path);
  this.routers[path] && this.routers[path]();
};

const route = new Router();
route.init(window.location.href);
const routes = [
  {
    path: "http://localhost:3001/",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "#fff";
    },
  },
  {
    path: "http://localhost:3001/color/blue",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "blue";
    },
  },
  {
    path: "http://localhost:3001/color/green",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "green";
    },
  },
  {
    path: "http://localhost:3001/color/red",
    callback: function () {
      let el = document.body;
      el.style.backgroundColor = "red";
    },
  },
];
/**
 * 将hash值与cb绑定
 */
route.route(routes);

/**
 * a标签会跳转页面，阻止
 */
window.addEventListener(
  "click",
  function (e) {
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if ((target.tagName = "A")) {
      e.preventDefault();
      route.go(e.target.getAttribute("href"));
    }
  },
  false
);
```

三、vue-router 实现？
四、react-router？
文章主要包含两大部分:
4.1 是对 react-router 赖以依存的 history 进行研究；
4.2 二是分析 react-router 是如何实现 URL 与 UI 同步的。
五、各自的优点？ 单页面相关？？
六、vue react 前端路由的应用？
七、 SPA

面试：TIP：

1. 项目难点（有些没讲清楚）
2. pureComponent
3. react-saga 的优点和缺点
4. typescript 泛型的介绍
5. === == 内部类型转换的原理
6. react 组件传值 方法
7. less sass css module 使用优点之类的
