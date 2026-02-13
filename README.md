# my-web-front

> Lightweight (~2 KB) JavaScript utility library for everyday frontend tasks.

## Features

- **DOM Selection** — `qs()`, `qsa()` wrappers around querySelector
- **Element Builder** — `el()` to create elements with attrs, events, and children
- **Event Helpers** — `on()`, `once()`, `delegate()` with auto-detach
- **Debounce & Throttle** — control function call frequency
- **CSS Helpers** — `addClass`, `removeClass`, `toggleClass`, `hasClass`, `cssVar`
- **Utilities** — `ready()`, `fetchJSON()`, `remove()`, `empty()`

## Install

```bash
npm install my-web-front
```

Or include directly:

```html
<script src="src/my-web-front.js"></script>
```

## Usage

```js
// ES Module
import mwf from 'my-web-front';

// Or use the global `mwf` object via <script> tag

mwf.ready(() => {
  const btn = mwf.qs('.btn');
  const off = mwf.on(btn, 'click', () => alert('Clicked!'));

  // Event delegation
  mwf.delegate(document.body, 'click', '.card', (e, card) => {
    mwf.toggleClass(card, 'active');
  });

  // Debounced search
  const search = mwf.debounce(q => console.log('Search:', q), 300);
  mwf.qs('#search').addEventListener('input', e => search(e.target.value));
});
```

## API

| Function | Description |
|---|---|
| `qs(sel, ctx?)` | Select one element |
| `qsa(sel, ctx?)` | Select all elements (returns Array) |
| `el(tag, attrs?, ...children)` | Create an element |
| `remove(node)` | Remove element from DOM |
| `empty(node)` | Remove all children |
| `addClass(node, ...cls)` | Add CSS classes |
| `removeClass(node, ...cls)` | Remove CSS classes |
| `toggleClass(node, cls, force?)` | Toggle a CSS class |
| `hasClass(node, cls)` | Check for a CSS class |
| `on(node, evt, fn, opts?)` | Add event listener (returns detach fn) |
| `once(node, evt, fn)` | One-time event listener |
| `delegate(parent, evt, sel, fn)` | Event delegation |
| `debounce(fn, ms)` | Debounce a function |
| `throttle(fn, ms)` | Throttle a function |
| `ready(fn)` | DOM ready callback |
| `cssVar(name, value?)` | Get/set CSS custom property |
| `fetchJSON(url, opts?)` | Fetch JSON with error handling |

## License

MIT
