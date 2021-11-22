<!--
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-22 15:05:54
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-22 15:07:03
-->

# 前言

有关 AST 这个知识点其实是很重要的，但平时可能并没有花太多时间去了解，这篇文章主要简单介绍个人平时整理的一些有关 AST 和自己的一些理解，包括其编译成代码的过程，和在一些前端编译工具里的一些应用场景。包括下面 👇🏻 一些点，可以稍微了解一下：

- Babel 中 ES6 转化成 ES5
- vue 模板编译是如何对 AST 进行应用
- css 预处理
- 开发 WebPack 插件
- UglifyJS 来压缩代码

当然也会了解到的一些有关 AST 抽象语法树基础知识点：

1.  js 引擎如何解析代码？过程？
1.  什么是抽象语法树 AST？

词法单元流转换成一个由元素嵌套所组成的代表了程序语法结构的树

3.  抽象语法树 AST 有什么用了，除了解析代码这块，在项目中又有什么用处？
4.  AST 的结构具体是怎样的? (为后续使用打下基础)
5.  AST 的编译过程是怎样的？（具体过程要理明白，说的清楚） （涉及不同的编译插件（可了解））

![截屏2021-11-21 上午11.32.19.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/756b13f54b77444e8adce303ce9678f4~tplv-k3u1fbpfcp-watermark.image?)

# 一、AST 是什么

## 1.1 JS 引擎解析过程

当引擎遇到 js 脚本时，会等到它的执行，实际上是需要引擎解析的

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef53bf39da24445eabb55c03b51c1a49~tplv-k3u1fbpfcp-zoom-1.image)

JS 是解释型语言，无需提前编译，而是由解释器实时运行

1.  读取代码，进行词法分析，然后将代码分解成词元（token）
1.  对词元进行语法分析，然后将代码整理成语法树
1.  使用翻译器，将代码转为字节码
1.  使用字节码解释器，将字节码转为机器码

为提高运行速度，现代浏览器采用即时编译（JIT）

## 1.2 Parser 编译 AST

js Parser 其实是一个解析器，它是将 js 源码转化为抽象语法树的解析器

解析过程分为两步：

1.  分词：将整个代码字符串分割成最小语法单元数组

ps:语法单元是被解析语法当中具备实际意义的最小单元，简单的来理解就是自然语言中的词语。

2. 语法分析：在分词的基础上建立分析语法单元之间的关系

js 代码中的语法单元主要包括这几类：

关键字、标识符、运算符、数字、字符串、空格、注释、其他。

AST 工具(<https://esprima.org/demo/parse.html#>)进行编译的时候需要 4 个步骤

### 1.词法分析 scanner

词法分析节点，首先会对代码进行扫描，会将代码生成 token 流

```
var name = 'jingda'
```

1.  我们会通过条件判断语句判断这个字符是 字母， "/" , "数字" , 空格 , "(" , ")" , ";" 等等。
1.  如果是字母会继续往下看如果还是字母或者数字，会继续这一过程直到不是为止，这个时候发现找到的这个字符串是一个 "var"， 是一个 Keyword，并且下一个字符是一个 "空格"， 就会生成{ "type" : "Keyword" , "value" : "var" }放入数组中。
1.  它继续向下找发现了一个字母 'name''(因为找到的上一个值是 "var" 这个时候如果它发现下一个字符不是字母可能直接就会报错返回)并且后面是空格，生成{ "type" : "Identifier" , "value" : "name" }放到数组中。
1.  发现了一个 "=", 生成了{ "type" : "Punctuator" , "value" : "=" }放到了数组中。
1.  发现了'jingda',生成了{ "type" : "String" , "value" : "jingda" }放到了数组中。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dbd5b412c464a739d23fcdac44af394~tplv-k3u1fbpfcp-zoom-1.image)

```
[
    {
        "type": "Keyword",
        "value": "var"
    },
    {
        "type": "Identifier",
        "value": "name"
    },
    {
        "type": "Punctuator",
        "value": "="
    },
    {
        "type": "String",
        "value": "'jingda'"
    }
]
```

### 2. Parser 生成 AST 树

(使用一款可以进行解析 AST 的插件)

解析：

```
const name = "jing"
```

使用 npm i esprima --save

```
const esprima = require('esprima');
let code = 'const name = "jing"';
const ast = esprima.parseScript(code);
console.log(ast);
```

```
Script {
  type: 'Program',
  body: [
    VariableDeclaration {
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'const'
    }
  ],
  sourceType: 'script'
}
```

### 3.traverse 对 AST 树遍历,进行增删改查

使用：npm i estraverse --save

```
将const name = "jing" 变成 const jing = “name”；
```

```
const esprima = require('esprima');
const estraverse = require('estraverse');
let code = 'const name = "jing"';
const ast = esprima.parseScript(code);
estraverse.traverse(ast, {
    enter: function (node) {
     node.name = 'team';
        node.value = "大转转FE";
    }
});
console.log(ast);
```

```
Script {
  type: 'Program',
  body: [
    VariableDeclaration {
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'const',
      name: 'team',
      value: '大转转FE'
    }
  ],
  sourceType: 'script',
  name: 'team',
  value: '大转转FE'
}
```

### 4.generator 将更新后的 AST 转化成代码

使用： npm i escodegen --save

```
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
let code = 'const name = "jingda" ';
const ast = esprima.parseScript(code);
estraverse.traverse(ast, {
    enter: function (node) {
     node.name = 'jingda';
        node.value = "name";
    }
});
const transformCode = escodegen.generate(ast);
console.log(transformCode);
```

```
➜  11.9-AST node parse1.js
const jingda = 'name';
```

babel,可以将 es2015+版本代码转换为向后兼容的 js 语法，以便能够运行在当前和旧版本的浏览器或其他环境中，不用为新语法的兼容性考虑~

实际上，babel 中的很多功能，都是靠修改 AST 实现的

通过抽象语法树解析，我们可以像童年时拆解玩具一样，透视 javascript 这台机器的运转，并且重新按着你的意愿来组装

---

```
function add(a,b) {
    return a + b;
}
```

它是一个函数定义对象

分成三大块：

1.  一个 id，就是它的名字 add
1.  两个 params 就是它的参数 [a,b]
1.  一块 body 也就是大括号内的一堆东西

add 作为一个最基础的 Identifier（标志）对象，用来作为函数的唯一标志，就像人的姓名一样

```
{
    name: 'add',
    type: 'identifier',
    ....
}
```

params 继续拆解，两个 Identifier 组成的数组

```
[
    {
       name: 'a',
       type: 'identifier',
       ....
    },
    {
       name: 'b',
       type: 'identifier',
       ....
    }
]
```

接下来看 body

body 是一个块级作用域，用来表示{return a + b}

进入这个块级作用域，里面还有 Return 域，用来表示 return a + b;

在 return 域里面有有个 BinaryExpression(二项式)对象 a + b

继续打开 BinaryExpression(二项式)对象 ，里面分成三部分 left operator right

- operator 即 +
- left 里面装的是 是 Identifier 对象 a
- right 里面装的，是 Identifer 对象 b

就这样简单的 add 函数拆解完毕

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cd0c5ab7256496fab0641a2a99a0109~tplv-k3u1fbpfcp-zoom-1.image)

\
\

# 二、AST 的应用场景

应用：

- Babel 中 ES6 转化成 ES5
- vue 模板编译是如何对 AST 进行应用
- css 预处理
- 开发 WebPack 插件
- UglifyJS 来压缩代码

我们常用的 babel 插件将 ES6 转化成 ES5、使用 UglifyJS 来压缩代码 、css 预处理器、开发 WebPack 插件、Vue-cli 前端自动化工具

解释器/编译器进行语法分析的基础

JS：代码压缩、混淆、编译

CSS：代码兼容多版本

HTML：Vue 中 Virtual DOM 的实现

它可以做什么呢？

1.  IDE 的错误提示、代码格式化、代码高亮、代码补全等
1.  JSLint、JSHint 对代码错误或风格的检查等
1.  webpack、rollup 进行代码打包等
1.  CoffeeScript、TypeScript、jsx 等转化为原生 js

## 2.1. AST 编译流程图

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e6c4c6bf5b44a8f9725f0a53b4c9d05~tplv-k3u1fbpfcp-zoom-1.image)

## 2.2. Babel 编译代码到 ES 低版本

babel 插件就是作用于抽象语法树 AST

其三大步骤分别是：解析 parse，转换 transform，生成 generate

1.  #### 解析 parse

词法分析（生成词元 token，AST 中的节点）和语法分析 （）

2.  #### 转换 transform

接收 AST，对其进行遍历，在该过程中对节点进行添加，更新和移除操作，Babel 通过 babel-traverse 对其进行深度优先遍历，维护 AST 树的整体状态

3.  #### 生成 generate

深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

Babel 通过 babel-generator 再转换成 js 代码，过程就是深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

## 2.3. VUE 模板编译

### 示意图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d625bcb2929b41d7a8de8fd523c362b7~tplv-k3u1fbpfcp-zoom-1.image)

### 步骤：

vue 中的模板编译主要分为三个步骤:

1.  解析器阶段: 将 template 里面的代码解析成 AST 抽象语法树;
1.  优化器阶段: 将 AST 抽象语法树静态标签打上 tag,防止重复渲染(优化了 diff 算法);
1.  代码生成器阶段: 优化后的 AST 抽象语法树通过 generate 函数生成 render 函数字符串；

```js
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  //生成ast的过程
  const ast = parse(template.trim(), options);
  //优化ast的过程,给ast抽象语法树静态标签打上tag,防止重复渲染
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  //通过generate函数生成render函数字符串
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
```

解析器要实现的功能就是将模板解析成 AST，主要运用的时候 parse()这个函数，事实上，解析器内部也分成了几个解析器，比如 HTML 解析器、文本解析器以及过滤解析器，其中最主要的就是 HTML 解析器。

HTML 解析器的作用就是解析 HTML，它在解析 HTML 的过程中会不断触发各种钩子函数

看看源码如何实现：

```
parseHTML(template, {
 //解析开始标签
 start (tag, attrs, unary, start, end) {

 },
 //解析结束标签
 end (tag, start, end) {

 },
 //解析文本
 chars (text: string, start: number, end: number) {

 },
 //解析注释
 comment (text: string, start, end){

 }
})
```

举个小 🌰：

```
<div>我是婧大</div>
```

当上面这个模板被 HTML 解析器解析的时候，所触发的钩子函数依次是 start，chars end

所以 HTML 解析器仔实现上实际是一个函数，它又两个参数--模板和选项，我们的模板是一小段，一小段去截取与解析的，所以需要不断循环截取

#### VUE 中如何实现：vue 解析器生成 AST 语法树的主流程

```
function parseHTML (html, options) {
 while (html) {
    //判断父元素为正常标签的元素的逻辑
   if (!lastTag || !isPlainTextElement(lastTag)) {
     //vue中要判断是 文本、注释、条件注释、DOCTYPE、结束、开始标签
     //除了文本标签， 其他的都是以 < 开头, 所以区分处理
     var textEnd = html.indexOf('<');
        if (textEnd === 0) {
         //注释的处理逻辑
         if (comment.test(html)) {}
         //条件注释的处理逻辑
         if (conditionalComment.test(html)) {}
         //doctype的处理逻辑
         var doctypeMatch = html.match(doctype);
                if (doctypeMatch) {}
                //结束标签的处理逻辑
                var endTagMatch = html.match(endTag);
                if (endTagMatch) {}
                //开始标签的处理逻辑
                var startTagMatch = parseStartTag();
                if (startTagMatch) {}
        }

             var text = (void 0), rest = (void 0), next = (void 0);
             //解析文本
             if (textEnd >= 0) {}
             // "<" 字符在当前 html 字符串中不存在
             if (textEnd < 0) {
                text = html
                html = ''
              }
              // 如果存在 text 文本
              // 调用 options.chars 回调，传入 text 文本
             if (options.chars && text) {
               // 字符相关回调
               options.chars(text)
             }
   }else{
    // 父元素为script、style、textarea的处理逻辑
   }
 }
}
```

## 2.4.TerserPlugin-webpack 插件   代码压缩

TerserPlugin：<https://webpack.docschina.org/plugins/terser-webpack-plugin/>

代码压缩，减小代码提交，提高带宽，更快的加载速度，更好的用户体验

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/059f634ad0b145009f27100e922d60f4~tplv-k3u1fbpfcp-zoom-1.image)

新创建一个 demo.js 文件

```
// 这是个测试

function add(a,b) {
    return a + b;
}
```

终端输入：

wc -c demo.js (用来衡量体积)

```
 207 demo.js
```

那么当代码的体积过大时，如何进行体积压缩呢？

首先需要清楚的是，在这段文件中我们真正有意义的代码其实只有

function add(a,b){return a+b};

而其他注释或者是空格，换行是不是多余的。可以尝试一下，把注释和空格去掉：

```
function add(a,b) {return a + b;}
```

```
181 demo.js
```

大小是减少了一些。

AST 运用：

那压缩代码的过程：code -> AST -> (transform)一颗更小的 AST -> code，这与 babel 和 eslint 的流程一模一样。

babel 使用的解析器 babylon，而 uglify 在代码压缩中使用到的解析器是 UglifyJS。

## 2.5. 在 webpack 中压缩代码

一切与性能优化相关的都可以在 optimization 中找到，TerserPlugin 是一个底层基于 uglifyjs 的用来压缩 JS 的插件。

你需要安装 terser-webpack-plugin：

```
$ npm install terser-webpack-plugin --save-dev
```

官方例子：

```
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```

## 2.6.ESlint 校验你的代码规则

### 2.6.1.初探

[ESLint 官网](https://eslint.bootcss.com/docs/user-guide/getting-started)

ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。在许多方面，它和 JSLint、JSHint 相似，除了少数的例外：

- ESLint 使用 [Espree](https://github.com/eslint/espree) 解析 JavaScript。
- ESLint 使用 AST 去分析代码中的模式
- ESLint 是完全插件化的。每一个规则都是一个插件并且你可以在运行时添加更多的规则。

将源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。

```
var ast = esprima.parse(text, { loc: true, range: true }),
    walk = astw(ast);

walk(function(node) {
    api.emit(node.type, node);
});

return messages;
```

那个时候 ESLint 并没有大火，因为需要将源代码转成 AST，运行速度上输给了 JSHint ，并且 JSHint 当时已经有完善的生态（编辑器的支持）。真正让 ESLint 大火是因为 ES6 的出现。

ES6 发布后，因为新增了很多语法，JSHint 短期内无法提供支持，而 ESLint 只需要有合适的解析器就能够进行 lint 检查。这时 babel 为 ESLint 提供了支持，开发了 babel-eslint，让 ESLint 成为最快支持 ES6 语法的 lint 工具。

为什么需要 ESLint

> JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。

#### 1. 避免低级 bug，找出可能发生的语法错误

使用未声明变量、修改 const 变量……

#### 2. 提示删除多余的代码

声明而未使用的变量、重复的 case ……

#### 3. 确保代码遵循最佳实践

可参考 [airbnb style](https://link.segmentfault.com/?enc=6d7d1I8O%2BUKxsWV6rm3G7Q%3D%3D.tLnyCRhwy2LTNL8emupDdwK2MtVjxvfwkDVXCGsObY0q379vTFYvpH8mDTx8l0Wl)、[javascript standard](https://link.segmentfault.com/?enc=xZdesOVZTGQ9CXL9WS461A%3D%3D.5u6VatqqlPOOa4JKGv7CkytUMEU3iF%2Bonnh72nQPdX3cq3ft1YTrKfGThr4n3p%2FH)

#### 4. 统一团队的代码风格

加不加分号？使用 tab 还是空格？

### 2.6.2.实践

<https://segmentfault.com/a/1190000019896962>

### 2.6.3.手写 ESlint 插件

<https://www.it610.com/article/1425136391708332032.htm>

ESLint 插件旨在校验代码注释是否写了注释：

- 每个声明式函数、函数表达式都需要注释；
- 每个 interface 头部和字段都需要注释；
- 每个 enum 头部和字段都需要注释；
- 每个 type 头部都需要注释；
- ......

知识点

- AST 抽象语法树
- ESLint
- Mocha 单元测试
- Npm 发布

yeoman 和 generator-eslint 来构建插件的脚手架代码 （为什么选取这两个工具来构建？？）

首先安装

npm install -g yo generator-eslint

# 三、一些实践

## 3.1、recast (可以操纵语法树的螺丝刀) 拆解

1.  `npm i recast -S`
1.  新建 parse.js 文件

### 3.1.1 尝试 1

```
// 使用recast 解析
const recast = require("recast");

// 需要被解析的代码
const code = `function add(a,b) {
    return a + b
}`

// 开始解析
const ast = recast.parse(code);
console.log(ast)
```

```
➜  11.9-AST node parse.js
{
  program: Script {
    type: 'Program',
    body: [ [FunctionDeclaration] ],
    sourceType: 'script',
    loc: {
      start: [Object],
      end: [Object],
      lines: [Lines],
      indent: 0,
      tokens: [Array]
    },
    errors: []
  },
  name: null,
  loc: {
    start: { line: 1, column: 0, token: 0 },
    end: { line: 3, column: 1, token: 13 },
    lines: Lines {
      infos: [Array],
      mappings: [],
      cachedSourceMap: null,
      cachedTabWidth: undefined,
      length: 3,
      name: null
    },
    indent: 0,
    tokens: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ]
  },
  type: 'File',
  comments: null,
  tokens: [
    { type: 'Keyword', value: 'function', loc: [Object] },
    { type: 'Identifier', value: 'add', loc: [Object] },
    { type: 'Punctuator', value: '(', loc: [Object] },
    { type: 'Identifier', value: 'a', loc: [Object] },
    { type: 'Punctuator', value: ',', loc: [Object] },
    { type: 'Identifier', value: 'b', loc: [Object] },
    { type: 'Punctuator', value: ')', loc: [Object] },
    { type: 'Punctuator', value: '{', loc: [Object] },
    { type: 'Keyword', value: 'return', loc: [Object] },
    { type: 'Identifier', value: 'a', loc: [Object] },
    { type: 'Punctuator', value: '+', loc: [Object] },
    { type: 'Identifier', value: 'b', loc: [Object] },
    { type: 'Punctuator', value: '}', loc: [Object] }
  ]
}
```

### 3.1.2 尝试 2

```
// 使用recast 解析
const recast = require("recast");

// 需要被解析的代码
const code = `function add(a,b) {
    return a + b
}`

// 开始解析
const ast = recast.parse(code);
console.log(ast)

// ast可以处理很多巨大的代码文件，这里只需要第一行。
const add =ast.program.body[0];

console.log(add);
```

```
{
  program: Script {
    type: 'Program',
    body: [ [FunctionDeclaration] ],
    sourceType: 'script',
    loc: {
      start: [Object],
      end: [Object],
      lines: [Lines],
      indent: 0,
      tokens: [Array]
    },
    errors: []
  },
  name: null,
  loc: {
    start: { line: 1, column: 0, token: 0 },
    end: { line: 3, column: 1, token: 13 },
    lines: Lines {
      infos: [Array],
      mappings: [],
      cachedSourceMap: null,
      cachedTabWidth: undefined,
      length: 3,
      name: null
    },
    indent: 0,
    tokens: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ]
  },
  type: 'File',
  comments: null,
  tokens: [
    { type: 'Keyword', value: 'function', loc: [Object] },
    { type: 'Identifier', value: 'add', loc: [Object] },
    { type: 'Punctuator', value: '(', loc: [Object] },
    { type: 'Identifier', value: 'a', loc: [Object] },
    { type: 'Punctuator', value: ',', loc: [Object] },
    { type: 'Identifier', value: 'b', loc: [Object] },
    { type: 'Punctuator', value: ')', loc: [Object] },
    { type: 'Punctuator', value: '{', loc: [Object] },
    { type: 'Keyword', value: 'return', loc: [Object] },
    { type: 'Identifier', value: 'a', loc: [Object] },
    { type: 'Punctuator', value: '+', loc: [Object] },
    { type: 'Identifier', value: 'b', loc: [Object] },
    { type: 'Punctuator', value: '}', loc: [Object] }
  ]
}
FunctionDeclaration {
  type: 'FunctionDeclaration',
  id: Identifier {
    type: 'Identifier',
    name: 'add',
    loc: {
      start: [Object],
      end: [Object],
      lines: [Lines],
      tokens: [Array],
      indent: 0
    }
  },
  params: [
    Identifier { type: 'Identifier', name: 'a', loc: [Object] },
    Identifier { type: 'Identifier', name: 'b', loc: [Object] }
  ],
  body: BlockStatement {
    type: 'BlockStatement',
    body: [ [ReturnStatement] ],
    loc: {
      start: [Object],
      end: [Object],
      lines: [Lines],
      tokens: [Array],
      indent: 0
    }
  },
  generator: false,
  expression: false,
  async: false,
  loc: {
    start: { line: 1, column: 0, token: 0 },
    end: { line: 3, column: 1, token: 13 },
    lines: Lines {
      infos: [Array],
      mappings: [],
      cachedSourceMap: null,
      cachedTabWidth: undefined,
      length: 3,
      name: null
    },
    tokens: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ],
    indent: 0
  }
}
```

## 3.2、recast.types.builders 重装

最简单的例子，我们想把之前的

```
function add(a, b){...}
```

声明，改成匿名函数式声明

```
const add = function(a ,b){...}
```

如何改装

1. 我们创建一个 VariableDeclaration 变量声明对象，声明头为 const， 内容为一个即将创建的 VariableDeclarator 对象。

2. 创建一个 VariableDeclarator，放置 add.id 在左边， 右边是将创建的 FunctionDeclaration 对象

3. 我们创建一个 FunctionDeclaration，如前所述的三个组件，id params body 中，因为是匿名函数 id 设为空，params 使用 add.params，body 使用 add.body。

这样，就创建好了 const add = function(){}的 AST 对象。

```
/*
 * @file: description
 * @author: longjing03
 * @Date: 2021-11-09 10:57:51
 * @LastEditors: longjing03
 * @LastEditTime: 2021-11-09 13:57:33
 */

// 使用recast 解析
const recast = require("recast");

// 需要被解析的代码
const code = `function add(a,b) {
    return a + b
}`

// 开始解析
const ast = recast.parse(code);

const add =ast.program.body[0];

// 引入变量声明，变量符号，函数声明三种“模具”
const {variableDeclaration, variableDeclarator, functionExpression} = recast.types.builders

// 将准备好的组件置入模具，并组装回原来的ast对象。
ast.program.body[0] = variableDeclaration("const", [
  variableDeclarator(add.id, functionExpression(
    null, // Anonymize the function expression.
    add.params,
    add.body
  ))
]);

//将AST对象重新转回可以阅读的代码
const output = recast.print(ast).code;

console.log(output)
```

```
const add = function(a, b) {
    return a + b
};
```

`recast.parse的逆向过程，具体`：

```
recast.print(recast.parse(source)).code === code
```

`打印美化格式的代码段`

```
const output = recast.prettyPrint(ast, {tabWidth: 2}).code

console.log(output)
```

```
const add = function(a, b) {
  return a + b;
};
```

到现在可以通过 AST 树去生成代码了

## 3.3、实战进阶： 命令行修改 js 文件

除了 parse/print/builder 以外，Recast 的三项主要功能：

- run: 通过命令行读取 js 文件，并转化成 ast 以供处理。
- tnt： 通过 assert()和 check()，可以验证 ast 对象的类型。
- visit: 遍历 ast 树，获取有效的 AST 对象并进行更改。

更新 ing。。。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4a570c86fef4e46aaeca189f22cf305~tplv-k3u1fbpfcp-watermark.image?)

文末有很多优秀文章，可以查阅。

❤ [AST 抽象语法树..](https://segmentfault.com/a/1190000016231512)

❤ [AST 实践和应用..](https://zhuanlan.zhihu.com/p/266697614)

❤ [从 AST 原理到 ESlint 实践..](https://www.it610.com/article/1425136391708332032.htm)

❤ [深入理解 ESLint..](https://segmentfault.com/a/1190000019896962)

❤ [掌握了 AST 原理..](https://juejin.cn/post/6844904019505184776)
