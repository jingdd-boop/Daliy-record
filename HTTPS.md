<!--
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-12 14:35:11
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-12 14:40:33
-->

# useState

## 1.不能在 set 后取到最新的值，虽然视图已经修改了

当点击按钮是，触发 handleClick

进行 `setCount(count+1)`

目标希望再 set 完之后，传最新的 count 给 add，如果直接在后面调用 add 函数，无法实现该功能。

```js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log(count, "1");
    setCount(count + 1); // 尝试在setCount之后取得修改的值，很明显取不到
    add(count, 2);
    console.log(count, "2");
  };

  const add = (a: any, b: any) => {
    console.log(a, b);
    return a + b;
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>{count}</div>
        <button onClick={handleClick}>点击加1</button>
      </header>
    </div>
  );
}

export default App;
```

视图上的`count= 1`已更新，但是控制台打印的值还是 0，add 函数取到的值也是 0。

解决：

```js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log(count, "1");
    setCount(count + 1);
  };

  const add = (a: any, b: any) => {
    console.log(a + b, "相加");
    return a + b;
  };

  useEffect(() => {
    add(count, 1);
  }, [count]);
  return (
    <div className="App">
      <header className="App-header">
        <div>{count}</div>
        <button onClick={handleClick}>点击加1</button>
      </header>
    </div>
  );
}

export default App;
```

可以看到此时 add 已经接收到最新的 count，并且打印出来了。

原因：

在 Hook 中直接修改 state 的一个对象（或数组）属性的某个子属性或值，然后直接进行 set，不会触发重新渲染。

## 2.修改了数组，但是页面没有刷新

```js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [arr, updateArr] = useState < any > ["1", "4", 4, "8"];
  const addList = () => {
    arr.push(1);
    updateArr(arr);
    console.log(arr, "arr");
  };
  return (
    <div>
      {arr.map((item: any, index: any) => (
        <p key={index}>
          {index} {item}
        </p>
      ))}
      <button onClick={addList}>添加List</button>
    </div>
  );
}

export default App;
```

修改成这样：

`updateArr([...arr]);`

有时候也会遇到修改对象属性的时候，也是可以通过这种方式进行修改

## 3.在 setTimeout 中使用 set，也会导致结果和想象不符

```js
function App() {
  const [count, updateCount] = useState(0);

  useEffect(() => {
    let timer = setTimeout(() => {
      updateCount(1);
      getCount();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getCount = () => {
    console.log(count, "updateCount(1)后面打印的count是"); // result: 0
  };

  return <div>{count}</div>;
}
```

- 使用 useRef 解决

- updateCount(count => count = 1);

```js
function App() {
  const [count, updateCount] = useState(0);

    useEffect(() => {
        let timer = setTimeout(() => {
            updateCount(1);
            getCount();
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, []);

    let ref = useRef();
    ref.current = count as any

    const getCount = () => {
        console.log(ref.current,'updateCount(1)后面打印的count是'); // result: 0
    };

    return (
        <div>{count}</div>
    );


```

## 4.同时多个 set，只会生效一个 （useState 异步更新）

```js
return (
  <p
    onClick={() => {
      updateNum(num + 1);
      updateNum(num + 1);
      updateNum(num + 1);
    }}
  >
    {num}
  </p>
);
```

点击只会一个一个加，不会直接变成 0

我们知道：

1. useState 每次执行会返回一个新的 state（简单类型的等值拷贝）
2. setState 会触发 UI 更新（重新 render，执行函数组件）
3. 由于 UI 更新是异步任务，所以 setState 也是一个异步过程

```js
function App() {
  console.log("render了");
  const [n, setN] = useState(0);
  return (
    <div className="App">
      <p>{n}</p>
      <button onClick={() => setN(n + 1)}>+1</button>
    </div>
  );
}
```

可以看到，在组件 App 里面打印`render了`，每次点击按钮都会执行

- 你会发现 App 在每一次点击 button，都进行了刷新
  每次 setN 都重新进行了 render console.log("render 了");

- 你会发现每次点击 button，打出的 n 都是不同的，第一次是 0，第二次是 1，第三次是 2 ...
  useState(0)中的 0 只在第一次初始化生效（否则每一次执行 n 都是 0）

一些原理性的 https://www.jianshu.com/p/d9158074176b
