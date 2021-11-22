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
