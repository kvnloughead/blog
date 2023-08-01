---
category: posts
author: Kevin Loughead
date: '2023-07-31T20:47:51.038Z'
title: Managing Slots without the Shadow DOM in Lit Components
---

The encapsulation benefits of the shadow DOM in a web component are nice, but in some cases unnecessary, or even a bit annoying. For instance, if you some general CSS classes that you'd like to apply inside multiple components.

You can opt out of the shadow DOM by adding this to your component:

```js
class MyComponent extends LitElement {
  createRenderRoot() {
    // disable shadow dom
    return this;
  }

  render() {
    return html`<h2>No shadow DOM here</h2>`;
  }
}
```

But doing so prevents you from using `<slot>`s in your component, which is unfortunate. But if you really want to disable the shadow DOM, you can roll your own slots, with a bit of DOM manipulation. Here's an example. Suppose we have the following component:

```js
render() {
    return html`
      <div>
        <h2>DIY slot example</h2>
        <div class="slot"></div>
      </div>
    `;
  }
```

We would like to use the component like this:

```html
<my-component>
  <p>This should go inside the slot</p>
  <p>This too</p>
</my-component>
```

To enslot these `<p>` tags, first wrap them in an appropriately "slotted" container. For instance,

```html
<my-component>
  <div slot="paragraphs">
    <p>This should go inside the slot</p>
    <p>This too</p>
  </div>
</my-component>
```

And add the following to the components `updated` method:

```js

  updated() {
    // schedule the slotting for the next microtask
    Promise.resolve().then(() => {
      // Select all children that have the appropriate `slot` attribute
      const slottedChildren = this.querySelectorAll("[slot='buttons']");
      const slot = this.querySelector(".slot");
      // add each of these children to the slot
      slottedChildren.forEach((child) => {
        slot.appendChild(child);
      });
    });
  }
```

Wrapping this in a promise appears to be necessary, although frankly I forget what the issue was. And also note that is is _not_ sufficient to simply render `this.children` into the slot, because that includes all children, including the one's that are already inside the component.

Kudos to phind.com and ChatGPT for helping me figure all this out.
