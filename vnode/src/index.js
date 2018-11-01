import {createElement} from "./create-element"
import {update} from "./update"
// const tree = createElement('div', { id: 'virtual-container' }, [
//   createElement('h1', {}, ['h1标签']),
//   createElement('h2', {}, ['h2标签']),
//   createElement('h3', {}, ['h3标签']),
//   createElement('p', {}, ['p标签']),
//   createElement('ul', {}, [
//     createElement('li', { key: '1', class: 'item'}, ['li标签1']),
//     createElement('li', { key: '2', class: 'item'}, ['li标签2']),
//     createElement('li', { key: '3', class: 'item'}, ['li标签3']),
//     createElement('li', { key: '4', class: 'item'}, ['li标签4']),
//     createElement('li', { key: '5', class: 'item'}, ['li标签5']),
//     createElement('li', { key: '6', class: 'item'}, ['li标签6']),
//     createElement('li', { key: '7', class: 'item'}, ['li标签7']),
//     createElement('li', { key: '8', class: 'item'}, ['li标签8']),
//   ]),
// ]);

const el = document.getElementById('app')
const vnode = createElement("div", {class: "testing"}, [
  createElement("p", {class: "demo"}, ['testingingigngn']),
  createElement("span", {class: "demo"}, ['123123123']),

])

update(el, vnode)