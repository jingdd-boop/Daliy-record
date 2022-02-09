/*
 * @file: description
 * @author: longjing03
 * @Date: 2022-02-09 10:06:56
 * @LastEditors: longjing03
 * @LastEditTime: 2022-02-09 11:18:18
 */
import React, { FC, useEffect, useState } from "react";

type ItestObj = {
  num: string;
  age: number;
};

type ItestArrItem = {
  name: string;
  count: number;
};

const App: FC = () => {
  const [testObj, setTestObj] = useState({} as ItestObj);
  const [testArr, setTestArr] = useState([] as ItestArrItem[]);

  const handleClickArr = () => {
    testArr.pop();
    setTestArr(testArr);
    console.log(testArr, "数组改变了吗");
  };

  const handleClickObj = () => {
    testObj.age = 18;
    setTestObj(testObj);
    console.log(testObj, "对象改变了吗");
  };

  return (
    <div className="App">
      <div onClick={handleClickArr}>点击去除数组最后一项</div>
      <div onClick={handleClickObj}>点击修改对象的值</div>
    </div>
  );
};

export default App;
