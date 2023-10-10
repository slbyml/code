import React from './react'
import ReactDOM from './react-dom'

let element1 = React.createElement(
  "li",
  {
    key: "element1",
    id: "element1"
  },
  "element1"
);
let element2 = React.createElement(
  "li",
  {
    key: "element2",
    id: "element2"
  },
  "element2"
);
let element3 = React.createElement(
  "li",
  {
    key: "element3",
    id: "element3"
  },
  "element3"
);

let element = React.createElement(
  "div",
  {
    key: "1",
    id: "aaa"
  },
  element1,
  element2,
  element3
);
ReactDOM.render(element, document.getElementById('root'))


document.getElementById('update').addEventListener('click', () => {
  // let test = React.createElement(
  //   "div",
  //   {
  //     key: "1",
  //     id: "bbb"
  //   },
  //   '222'
  // );
  let element22 = React.createElement(
    "p",
    {
      key: "element2",
      id: "element2"
    },
    "element22"
  );
  let test = React.createElement(
    "div",
    {
      key: "1",
      id: "aaa"
    },
    element1,
    element22,
    element3
  );
  ReactDOM.render(test, document.getElementById('root'))
})
