import React from './react'
import ReactDOM from './react-dom'

let element1 = React.createElement(
  "li",
  {
    key: "a",
    id: "a"
  },
  "a"
);
let element2 = React.createElement(
  "li",
  {
    key: "b",
    id: "b"
  },
  "b"
);
let element3 = React.createElement(
  "li",
  {
    key: "c",
    id: "c"
  },
  "c"
);
let element4 = React.createElement(
  "li",
  {
    key: "d",
    id: "d"
  },
  "d"
);
let element5 = React.createElement(
  "li",
  {
    key: "e",
    id: "e"
  },
  "e"
);
let element6 = React.createElement(
  "li",
  {
    key: "f",
    id: "f"
  },
  "f"
);

let element = React.createElement(
  "div",
  {
    key: "1",
    id: "aaa"
  },
  element1,
  element2,
  element3,
  element4,
  element5,
  element6
);
ReactDOM.render(element, document.getElementById('root'))


document.getElementById('update').addEventListener('click', () => {

  let element11 = React.createElement(
    "li",
    {
      key: "a",
      id: "a"
    },
    "a"
  );
  let element22 = React.createElement(
    "li",
    {
      key: "c",
      id: "c"
    },
    "c"
  );
  let element33 = React.createElement(
    "li",
    {
      key: "e",
      id: "e"
    },
    "e"
  );
  let element44 = React.createElement(
    "li",
    {
      key: "b",
      id: "b2"
    },
    "b2"
  );
  let element55 = React.createElement(
    "li",
    {
      key: "g",
      id: "g"
    },
    "g"
  );
  let element66 = React.createElement(
    "li",
    {
      key: "d",
      id: "d"
    },
    "d"
  );
  let test = React.createElement(
    "div",
    {
      key: "1",
      id: "aaa"
    },
    element11,
    element22,
    element33,
    element44,
    element55,
    element66
  );
  ReactDOM.render(test, document.getElementById('root'))
})
