let taskId = 0
function workLoop(deadLine) {
  taskId++
  while (!deadLine.timeRemaining() < 1) {
    console.log('taskId', taskId);
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)