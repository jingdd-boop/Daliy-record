/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-12-13 20:16:51
 * @LastEditors: longjing03
 * @LastEditTime: 2021-12-13 20:23:08
 */

import "./public-path";
import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import store from "./store";

Vue.use(VueRouter);
Vue.config.productionTip = false;

let router = null;
let instance = null;
function render(parent = {}) {
  const router = new VueRouter({
    // histroy模式的路由需要设置base，app-history-vue根据项目名称来定
    base: window.__POWERED_BY_QIANKUN__ ? "/app-history-vue" : "/",
    mode: "history",
    // hash模式不需要上面两行
    routes: [],
  });
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
    data() {
      return {
        parentRouter: parent.router,
        parentVuex: parent.store,
      };
    },
  }).$mount("#appVueHistory");
}
//全局变量来判断环境，独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("vue app bootstraped");
}
export async function mount(props) {
  console.log("props from main framework", props);
  render(props.data);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}
