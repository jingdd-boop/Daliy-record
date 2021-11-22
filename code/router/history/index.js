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
