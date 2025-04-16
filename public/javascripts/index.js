// helper function for creating elements
// usage optional
// example:
//   // h1 with link as child
//   const a = createElement('a', {href: '/foo'})
//   a.textContent = 'foo'
//   const h1 = createElement('h1', {id: 'foo'}, a)
function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);

  // add element attributes
  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }

  // add child nodes to element
  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));

  return ele;
}

// TODO: finish client side javascript
