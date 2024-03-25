import React from './core/React.js'

function Counter({num}) {
  return <div>Count: {num}</div>
}
// const App = React.createElement('div', { id: 'app' }, <div>Hi-mini-react</div>)
function App() {
  return (
    <div>
      Hi-mini-react
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  )
}
export default App


