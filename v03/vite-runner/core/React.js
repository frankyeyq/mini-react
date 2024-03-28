function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };

  nextWorkofUnit = wipRoot
}

let wipRoot = null;
let nextWorkofUnit = null;
let currentRoot = null;
let deletions = []
let wipFiber = null
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkofUnit) {
    nextWorkofUnit = performWorkOfUnit(nextWorkofUnit);

    if (wipRoot?.sibling?.type === nextWorkofUnit?.type) {
      nextWorkofUnit = undefined
    }

    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWorkofUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = []
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // Object.keys(nextProps).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventName = key.slice(2).toLowerCase();
  //       dom.addEventListener(eventName, nextProps[key]);
  //     } else {
  //       dom[key] = nextProps[key];
  //     }
  //   }
  // });
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (prevProps[key] !== nextProps[key]) {
        if (key.startsWith("on")) {
          const eventName = key.slice(2).toLowerCase();
          dom.removeEventListener(eventName, prevProps[key]);
          dom.addEventListener(eventName, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null;
  children.forEach((child, index) => {
    let newFiber
    const isSameType = oldFiber && oldFiber.type === child.type;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'update',
        alternate: oldFiber
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement'
        };
      }
      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    if (newFiber) {
      prevChild = newFiber;
    } 
  });
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function updateFunctionComponent(fiber) {
  console.log('updateFunctionComponent', fiber);
  wipFiber = fiber
  const children = [fiber.type(fiber.props)];

  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if(isFunctionComponent){
    updateFunctionComponent(fiber)
  }else{
    updateHostComponent(fiber)
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

const update = () => {
  console.log('update');
  let currentFiber = wipFiber
  console.log(currentFiber);
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextWorkofUnit = wipRoot
  }
}


const React = {
  render,
  createElement,
  update
};

export default React;
