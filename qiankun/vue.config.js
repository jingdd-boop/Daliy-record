/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-12-13 20:23:27
 * @LastEditors: longjing03
 * @LastEditTime: 2021-12-13 20:23:27
 */
const { name } = require("./package");

module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把子应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
