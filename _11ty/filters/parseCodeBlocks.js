/**
 * Adds a copy button to Prism.js highlighted HTML code blocks.
 *
 * @param {string} content - Raw HTML content containing Prism.js highlighted code blocks
 * @returns {string} HTML content with code blocks wrapped in copy-enabled containers
 *
 * @description
 * This function:
 * 1. Finds code blocks with language-specific classes (from Prism.js)
 * 2. Decodes HTML entities to preserve formatting
 * 3. Wraps blocks in a container div with a copy button
 * 4. Stores decoded content in data-clipboard-text for copying
 *
 * @example
 * // Input
 * <pre class="language-bash"><code class="language-bash">npm install</code></pre>
 *
 * // Output
 * <div class="code-block">
 *   <pre class="language-bash"><code class="language-bash">npm install</code></pre>
 *   <button class="code-block__copy-button" data-clipboard-text="npm install">Copy</button>
 * </div>
 *
 * @see Related client-side implementation in src/scripts/code-copy-client.js
 * @see Used as an 11ty filter in .eleventy.js
 */
function parseCodeBlocks(content) {
  return content.replace(
    /<pre class="language-([^"]+)"><code class="language-[^"]+">([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      // Decode HTML entities and preserve whitespace
      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ") // Decode non-breaking spaces
        .replace(/&#10;/g, "\n");

      return `
        <div class="code-block">
          <pre class="language-${language}"><code class="language-${language}">${code}</code></pre>
          <button class="code-block__copy-button" data-clipboard-text="${encodeURIComponent(
            decodedCode
          )}">Copy</button>
        </div>
      `;
    }
  );
}

module.exports = parseCodeBlocks;
