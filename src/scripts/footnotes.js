module.exports = function (htmlString) {
  // Converts GitHub markdown footnotes into HTML footnotes
  const footnoteRegex = /\[\^([1-9])\]/g;
  const footnotes = new Set();
  const { fileSlug } = this.ctx.page;
  htmlString = htmlString.replace(footnoteRegex, (match, $1) => {
    if (!footnotes.has($1)) {
      footnotes.add($1);
      return `<a class="footnote footnote_head" 
                 href="#${fileSlug}-footnote-${$1}">
                (${$1})
              </a>
              <span
                id="${fileSlug}-backlink-${$1}">
              </span>
      `;
    }
    return `
            <a class="footnote footnote_foot" 
               id="${fileSlug}-footnote-${$1}" 
               href="#${fileSlug}-backlink-${$1}">
               (${$1})
            </a>`;
  });
  return htmlString;
};
