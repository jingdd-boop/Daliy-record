/*
 * @file: description
 * @author: longjing03
 * @Date: 2022-02-08 19:10:19
 * @LastEditors: longjing03
 * @LastEditTime: 2022-02-08 19:14:14
 */
const http = require("http");

const hostname = "127.0.0.1"; //域名
const port = 3000; //端口

// 创建服务server   http.createServer  接收一个回调函数作为参数的方法
const server = http.createServer((req, res) => {
  res.statusCode = 200; //返回码
  res.setHeader("Content-Type", "text/plain"); // 头部字段
  res.end("Hello World"); // 返回
});

// 监听 端口 域名ip  回调函数（返回结果）
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
