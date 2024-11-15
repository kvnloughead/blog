function parseCodeBlocks(content) {
  return content.replace(
    /<pre class="language-([^"]+)"><code class="language-[^"]+">([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      return `
        <div class="code-block">
          <pre class="language-${language}"><code class="language-${language}">${code}</code></pre>
          <button class="code-block__copy-button" data-clipboard-target>Copy</button>
        </div>
      `;
    }
  );
}

module.exports = parseCodeBlocks;
