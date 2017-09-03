# calculator
基于 Electron + javascript 实现的桌面计算器应用。

相关文章：[Electron 实战桌面计算器应用](https://github.com/lin-xin/blog/issues/22)

## 介绍
我这里通过 Electron 实现了仿 iPhone 的计算器，通过菜单可以切换横屏和竖屏，横屏有更多的运算。

而对于 JavaScript 进行浮点数计算来说，精度丢失是个很大问题，所以我这里使用了第三方库 math.js 来解决这个精度的问题。 

尽可能的实现了跟 iPhone 一样的运算：

- 1 + 2 × 3 = 7
- 3 += 6 (再按 = 等于 9)
- 0.1 + 0.2 = 0.3 (浮点数精度处理)

## 效果图
![Image text](https://github.com/lin-xin/calculator/raw/master/screenshot/calc1.jpg)
![Image text](https://github.com/lin-xin/calculator/raw/master/screenshot/calc2.jpg)

## 环境

- windows 7
- Electron v1.7.5

## 运行
```
git clone https://github.com/lin-xin/calculator.git
npm install
npm start
```
就会运行起来了。

## 构建
```
npm run build:win
```
则会在项目中生成个 /计算器-win32-x64 文件夹，打开里面的 计算器.exe 即可打开计算器。

或者
```
npm run dist
```
则会生成 dist/ 文件夹，里面有应用的安装包，就可以双击安装了。安装过程中可能会有360卫士等提示危险，不用管继续安装就可以。