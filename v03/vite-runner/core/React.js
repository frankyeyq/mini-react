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
let root = null

function workLoop(deadLine) {
  let shouldYield = false
  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performWorkOfUnit(nextWorkUnit)
    shouldYield = !deadLine.timeRemaining() < 1
  }

  if (!nextWorkUnit && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

const commitRoot = () => {
  commitWork(root.child)
  root = null
}

const commitWork = fiber => {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  fiber.dom && fiberParent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

const createDom = type => {
  const res =  type === 'TEXT_ELEMENT' 
  ? document.createTextNode('') 
  : document.createElement(type)
  return res
}

const updateProps = (dom, props) => {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

const initChildren = (fiber, children) => {
  if (children && children.length) {
    let prevChild = null
    children.forEach((child, idx) => {
      const newFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        child: null,
        sibling: null,
        parent: fiber
      }
      if (idx === 0) {
        fiber.child = newFiber
      } else {
        prevChild.sibling = newFiber
      }
      prevChild = newFiber
    })
  }
}

const performWorkOfUnit = fiber => {
  const isFunctionComponent = fiber.type instanceof Function
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))
      // fiber.parent.dom.append(dom)
      updateProps(dom, fiber.props)
    }
  }
  const children = isFunctionComponent ? [fiber.type()] : fiber.props.children
  initChildren(fiber, children)
  
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  if (fiber.parent) {
    return fiber.parent.sibling
  }
}



const render = (el, container) => {
  nextWorkUnit = root = {
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