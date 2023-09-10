import React from './react'
import ReactDOM from './react-dom'

let element = React.createElement(
  "div",
  {
    key: "1",
    id: "aaa"
  },
  "213"
);
ReactDOM.render(element, document.getElementById('root'))

// console.log(element);
