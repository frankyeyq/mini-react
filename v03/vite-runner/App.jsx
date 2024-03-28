import React from './core/React.js'


let countFoo = 1
function Foo() {
  const update = React.update()
  function handleClick() {
    console.log('123');
    countFoo++
    update()
  }
  return (
    <div>
      <h1>Foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

let countBar = 1
function Bar() {
  const update = React.update()
  function handleClick() {
    countBar++
    update()
  }
  return (
    <div>
      <h1>Bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

function App() {
  return (
    <div>
      Hi-mini-react
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}
export default App


