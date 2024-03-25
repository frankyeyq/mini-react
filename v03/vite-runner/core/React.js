const createTextNode = (nodeValue) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue,
      children: []
    }
  }
}

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'object' ? child : createTextNode(child))
    }
  }
}

let nextWorkUnit = null

function workLoop(deadLine) {
  let shouldYield = false
  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performWorkOfUnit(nextWorkUnit)
    shouldYield = !deadLine.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

let taskId = 0
const performWorkOfUnit = work => {
  //1. 创建dom
  if (!work.dom) {
    const dom = (work.dom = 
      work.type === 'TEXT_ELEMENT' 
        ? document.createTextNode('') 
        : document.createElement(work.type))
    work.parent.dom.append(dom)

    Object.keys(work.props).forEach(key => {
      if (key !== 'children') {
        dom[key] = work.props[key]
      }
    })
  }
  //2. 将dom结构转换成链表结构
  const children = work.props.children
  if (children && children.length) {
    let prevChild = null
    children.forEach((child, idx) => {
      const newWork = {
        type: child.type,
        props: child.props,
        dom: null,
        child: null,
        sibling: null,
        parent: work
      }
      if (idx === 0) {
        work.child = newWork
      } else {
        prevChild.sibling = newWork
      }
      prevChild = newWork
    })

    if (work.child) {
      return work.child
    }
    if (work.sibling) {
      return work.sibling
    }
    if (work.parent) {
      return work.parent.sibling
    }
  }
}

const render = (el, container) => {
  nextWorkUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
}
requestIdleCallback(workLoop)





const React = {
  render,
  createElement
}

export default React