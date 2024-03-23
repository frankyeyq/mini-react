import ReactDom from './core/ReactDom.js'
import App from './App.js'
// 版本1: 写死
// 实现在root节点生成“app”字符串
// 最核心原理DOM相关api
// const root = document.querySelector('#root')
// const appendDom = document.createElement('div')
// appendDom.innerText = 'app'
// root.append(appendDom)


// 版本2: 虚拟dom
// 虚拟dom其实就是用object来描述dom结构，然后用这个object来生成真实dom
// 先用vdom来描述一下app节点，然后通过vdom生成真实dom
const el = {
  type: 'div',
  children: [
    {
      type: 'TEXT_ELEMENT',
      nodeValue: 'app'
    }
  ]
}

const root = document.querySelector('#root')

ReactDom.createRoot(root).render(App)