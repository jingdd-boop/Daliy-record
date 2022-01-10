<!--
 * @file: description
 * @author: longjing03
 * @Date: 2022-01-10 20:26:11
 * @LastEditors: longjing03
 * @LastEditTime: 2022-01-10 20:34:33
-->

## immer 是什么？

核心实现是利用 ES6 的 proxy，几乎以最小的成本实现了 js 的不可变数据结构，简单易用、体量小巧、设计巧妙，满足了我们对 JS 不可变数据结构的需求。

## 数据处理存在的问题

定义一个对象 currentState，什么情况下会改变这个对象呢？

```js
let currentState = {
  p: {
    x: [2],
  },
};
```

```js
// Q1 直接修改对象里面的属性
let o1 = currentState;
o1.p = 1; // currentState 被修改了
o1.p.x = 1; // currentState 被修改了

// Q2  对象作为函数参数
fn(currentState); // currentState 被修改了
function fn(o) {
  o.p1 = 1;
  return o;
}

// Q3 通过扩展运算符...
let o3 = {
  ...currentState,
};
o3.p.x = 1; // currentState 被修改了

// Q4  数组方法改变
let o4 = currentState;
o4.p.x.push(1); // currentState 被修改了
```

## 解决引用对象被改变的问题？

1. 深拷贝
2. ImmutableJS，非常棒的一个不可变数据结构的库，可以解决上面的问题，But，跟 Immer 比起来，ImmutableJS 有两个较大的不足：

- 需要使用者学习它的数据结构操作方式，没有 Immer 提供的使用原生对象的操作方式简单、易用；
- 它的操作结果需要通过 toJS 方法才能得到原生对象，这使得在操作一个对象的时候，时刻要主要操作的是原生对象还是 ImmutableJS 的返回结果，稍不注意，就会产生意想不到的 bug。

## immer 功能介绍

解决 q1 和 q3

```js
import produce from "immer";
let o1 = produce(currentState, (draft) => {
  draft.p.x = 1;
});
```

解决 q2

```js
import produce from "immer";
fn(currentState); // currentState 被修改了
function fn(o) {
  return produce(o, (draft) => {
    draft.p1 = 1;
  });
}
```

解决 q4

```js
import produce from "immer";
let o4 = produce(currentState, (draft) => {
  draft.p.x.push(1);
});
```
