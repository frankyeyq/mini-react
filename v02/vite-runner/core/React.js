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

const render = (el, container) => {
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
  Object.keys(el.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = el.props[key]
    }
  })

  const children = el.props.children
  children.forEach(child => {
    render(child, dom)
  })

  container.append(dom)
}


const React = {
  render,
  createElement
}

export default React