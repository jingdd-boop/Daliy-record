<!--
 * @file: description
 * @author: longjing03
 * @Date: 2022-01-09 10:30:41
 * @LastEditors: longjing03
 * @LastEditTime: 2022-01-10 20:26:02
-->

# 输入 URL 开始建立前端知识体系

## 前置内容 浏览器主要进程

浏览器是多进程的

- 浏览器主进程：主要控制页面的穿甲，销毁和网络管理资源载
- 第三方插件进程
- GPU 进程
- 浏览器渲染进程：每个 tab 页对应一个进程，互不影响

## 第一部分 输入网站并解析

- url 结构字符串
- 非 url 结构字符串，会用浏览器默认搜索引擎搜索该字符串

### url 的组成：

> 协议，主机，端口，路径，查询参数，锚点
> `https://baidu.com:9999/222222/index.html?name=jj&age=wang#header`

### 解析 URL

输入 url 后，浏览器会解析出协议，主机，端口，路径，并构造出 http 请求

1. 浏览器发送请求后，跟你讲请求头的 expires 和 cache-control 判断是否命中（包含是否过期）强缓存策略，如果命中，直接从缓存获取资源，不会发送请求
2. 没有命中缓存，浏览器会发送请求，根据请求头的 If-Modified-Since 和 If-None-Match 判断是否命中协商缓存，如果命中，直接从缓存获取资源。如果没有命中，则进入下一步。
3. 如果前两步都没有命中，则直接从服务端获取资源。
