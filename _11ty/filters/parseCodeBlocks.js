/**
 * Adds a copy button to HTML code blocks that have been highlighted by
 * Prism.js, except those that are preceded by a <!-- no-copy --> comment.
 *
 * @param {string} content - Raw HTML content containing code blocks that have been highlighted by Prism.js
 * @returns {string} HTML content with code blocks either including a copy button, or the no-copy class.
 *
 * @description
 * This function:
 * 1. Identifies code blocks preceded by <!-- no-copy --> comments and marks
 *    them with the no-copy class to skip copy functionality
 * 2. For remaining code blocks:
 *    - Finds code blocks with language-specific classes (from Prism.js)
 *    - Decodes HTML entities to preserve formatting
 *    - Wraps blocks in a container div with a copy button
 *    - Stores decoded content in data-clipboard-text for copying
 *
 * @example
 * // Input (will be given a copy button)
 * <pre class="language-bash"><code class="language-bash">npm install</code></pre>
 *
 * // Input (will not be given a copy button)
 * <!-- no-copy -->
 * <pre class="language-bash"><code class="language-bash">npm install</code></pre>
 *
 * // Output (with copy button)
 * <div class="code-block">
 *   <pre class="language-bash"><code class="language-bash">npm install</code></pre>
 *   <button class="code-block__copy-button" data-clipboard-text="npm install">Copy</button>
 * </div>
 *
 * // Output (without copy button)
 * <pre class="language-bash no-copy"><code class="language-bash">npm install</code></pre>
 *
 * @see Related client-side implementation in src/scripts/code-copy-client.js
 * @see Used as an 11ty filter in .eleventy.js
 * @see Add <!-- no-copy --> comment above any code block that shouldn't have a * copy button, either in the HTML or markdown
 */
function parseCodeBlocks(content) {
  // First find code blocks preceded by no-copy comment
  // [\n\r]* allows for zero or more newlines between comment and code block
  content = content.replace(
    /<!--\s*no\-copy\s*-->[\n\r]*<pre class="language-([^"]+)"><code class="language-[^"]+">([\s\S]*?)<\/code><\/pre>/g,
    '<pre class="language-$1 no-copy"><code class="language-$1">$2</code></pre>'
  );

  // Then process remaining code blocks as normal
  return content.replace(
    /<pre class="language-([^"]+)(?:\s+no-copy)?"><code class="language-[^"]+">([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      if (match.includes("no-copy")) {
        return match;
      }

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
