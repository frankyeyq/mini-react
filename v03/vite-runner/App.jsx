import React from './core/React.js'

function Counter() {
  return <div>Counte</div>
}
// const App = React.createElement('div', { id: 'app' }, <div>Hi-mini-react</div>)
const App = <div>Hi-mini-react<Counter></Counter></div>
console.log(App);
export default App


