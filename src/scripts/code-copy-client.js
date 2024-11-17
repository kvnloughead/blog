/**
 * Initializes copy functionality for code block buttons
 *
 * @description
 * This script:
 * 1. Attaches click handlers to all code block copy buttons
 * 2. Extracts code content from adjacent code blocks
 * 3. Decodes HTML entities and converts <br> tags to newlines
 * 4. Copies formatted text to clipboard
 * 5. Shows temporary "Copied!" feedback
 *
 * @example
 * // HTML Structure
 * <div class="code-block">
 *   <pre><code>some code</code></pre>
 *   <button class="code-block__copy-button">Copy</button>
 * </div>
 *
 * // Decoded Entities
 * &lt; → <
 * &gt; → >
 * &amp; → &
 * &quot; → "
 * &#39; → '
 * <br> → \n
 *
 * @see Related server-side implementation in _11ty/filters/parseCodeBlocks.js
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".code-block__copy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const codeBlock = button.previousElementSibling.querySelector("code");
      const text = codeBlock.innerHTML
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<br>/g, "\n");

      navigator.clipboard.writeText(text);

      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    });
  });
});
