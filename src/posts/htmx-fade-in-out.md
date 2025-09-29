---
title: "Fade In/Out Transitions in HTMX"
category: posts
author: Kevin Loughead
date: "2024-09-28T14:19:05.954Z"
tags: ["htmx", "css"]
---

I'm trying [HTMX](https://htmx.org) and tried following the fade in/out patterns shown in [these examples](https://htmx.org/examples/animations/) but didn't succeed with them. Possibly because the examples only show fade in/out when the event target is the element being swapped. To make it work on a separate element took some trial and error. Here are the results.

Here's the component:

```go
package templates

// Modal is a template for a generic modal with a close button
templ Modal() {
	<div
		id="modal"
		class="modal"
		hx-on::after-settle="this.classList.add('show')"
	>
		<div class="modal-content">
			<h2>Modal Dialog</h2>
			<p>This is the modal content</p>
			<button
				type="button"
				class="btn"
				hx-delete="/modal"
				hx-target="#modal"
				hx-swap="outerHTML swap:0.3s"
			>
				Close
			</button>
		</div>
	</div>
}
```

The necessary styles were similar to what's described in [this article](https://greywyvern.com/337) accept a bit of extra work was necessary to handle the exit transition.

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0 10px;

  /* Transition styles: see https://greywyvern.com/337 */
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 0.5s, opacity 0.5s linear;
}

/* Entrance transition: see https://greywyvern.com/337 */
.modal.show {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}

/* Exit transition */
.modal.htmx-swapping {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}
```

The button to open the modal looks like this. Note the `swap:0.3s` field in the `hx-swap` attribute.

```html
<button
  type="button"
  hx-get="/modal"
  hx-target="#modal"
  hx-swap="outerHTML swap:0.3s"
  class="btn"
>
  Open Modal
</button>
```